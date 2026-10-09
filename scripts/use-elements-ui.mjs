import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = fileURLToPath(new URL("../", import.meta.url));
const packageName = "@jnpll/elements-ui";

/**
 * @param {string} mode
 * @param {(command: string, args: string[], options: import('node:child_process').ExecFileSyncOptions) => string | Buffer | undefined} run
 */
export function useElementsUi(mode, run = (command, args, options) => execFileSync(command, args, options)) {
  if (mode !== "local" && mode !== "published") {
    throw new Error("Usage: use-elements-ui.mjs <local|published>");
  }
  const manifest = JSON.parse(readFileSync(path.join(appDirectory, "package.json"), "utf8"));
  const libraryDirectory = path.resolve(appDirectory, "../elements-ui");
  if (mode === "local") {
    const library = JSON.parse(readFileSync(path.join(libraryDirectory, "package.json"), "utf8"));
    if (library.name !== packageName) throw new Error(`Expected ${packageName} at ${libraryDirectory}`);
    run("npm", ["run", "build"], { cwd: libraryDirectory, stdio: "inherit" });
  }

  const staging = mkdtempSync(path.join(tmpdir(), "elements-ui-"));
  try {
    const args = ["pack", "--ignore-scripts", "--json", "--pack-destination", staging];
    if (mode === "published") args.push(`${packageName}@${manifest.dependencies[packageName]}`);
    const output = run("npm", args, {
      cwd: mode === "local" ? libraryDirectory : appDirectory,
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"],
    });
    const [archive] = JSON.parse(String(output));
    if (!archive?.filename || path.basename(archive.filename) !== archive.filename) {
      throw new Error("npm pack did not return a valid archive filename");
    }
    // Install an actual package artifact so React resolves from the app, not the sibling checkout.
    run("npm", ["install", "--no-save", "--package-lock=true", "--ignore-scripts", "--no-audit", "--no-fund", path.join(staging, archive.filename)], {
      cwd: appDirectory,
      stdio: "inherit",
    });
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  console.log(`Installed ${mode} elements-ui. Restart the dev server to load the updated package.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    useElementsUi(process.argv[2]);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
