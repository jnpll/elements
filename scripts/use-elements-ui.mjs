import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = fileURLToPath(new URL("../", import.meta.url));
const packageName = "@jnpll/elements-ui";
const installedDirectory = path.join(appDirectory, "node_modules", "@jnpll", "elements-ui");
const localMarker = path.join(installedDirectory, ".elements-ui-local");

/**
 * @param {string} mode
 * @param {(command: string, args: string[], options: import('node:child_process').ExecFileSyncOptions) => string | Buffer | undefined} run
 */
export function useElementsUi(mode, run = (command, args, options) => execFileSync(command, args, options), installLocal = (libraryDirectory, appDirectory) => {
  const destination = path.join(appDirectory, "node_modules", "@jnpll", "elements-ui");
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(path.join(libraryDirectory, "dist"), path.join(destination, "dist"), { recursive: true });
  writeFileSync(path.join(destination, "package.json"), readFileSync(path.join(libraryDirectory, "package.json")));
  writeFileSync(path.join(destination, ".elements-ui-local"), `${libraryDirectory}\n`);
}) {
  if (mode === "status") {
    const source = existsSync(localMarker) ? "local sibling checkout" : "published package (or unmarked installation)";
    const alpha001 = existsSync(path.join(installedDirectory, "dist", "collections", "alpha", "palettes", "001.css"));
    console.log(`elements-ui: ${source}; Alpha 001: ${alpha001 ? "present" : "absent"}`);
    return;
  }
  if (mode !== "local" && mode !== "published") {
    throw new Error("Usage: use-elements-ui.mjs <local|published|status>");
  }
  const manifest = JSON.parse(readFileSync(path.join(appDirectory, "package.json"), "utf8"));
  const libraryDirectory = path.resolve(appDirectory, "../elements-ui");
  if (mode === "local") {
    const library = JSON.parse(readFileSync(path.join(libraryDirectory, "package.json"), "utf8"));
    if (library.name !== packageName) throw new Error(`Expected ${packageName} at ${libraryDirectory}`);
    run("npm", ["run", "build"], { cwd: libraryDirectory, stdio: "inherit" });
    // Copy only the built package so its React peer resolves from this app.
    installLocal(libraryDirectory, appDirectory);
    console.log("Installed local elements-ui snapshot. Restart the dev server to load the updated package.");
    return;
  }

  const staging = mkdtempSync(path.join(tmpdir(), "elements-ui-"));
  try {
    const env = { ...process.env, npm_config_cache: path.join(staging, "npm-cache") };
    const args = ["pack", "--ignore-scripts", "--json", "--pack-destination", staging];
    if (mode === "published") args.push(`${packageName}@${manifest.dependencies[packageName]}`);
    const output = run("npm", args, {
      cwd: mode === "local" ? libraryDirectory : appDirectory,
      encoding: "utf8",
      env,
      stdio: ["inherit", "pipe", "inherit"],
    });
    const [archive] = JSON.parse(String(output));
    if (!archive?.filename || path.basename(archive.filename) !== archive.filename) {
      throw new Error("npm pack did not return a valid archive filename");
    }
    // Install an actual package artifact so React resolves from the app, not the sibling checkout.
    run("npm", ["install", "--no-save", "--package-lock=true", "--ignore-scripts", "--no-audit", "--no-fund", path.join(staging, archive.filename)], {
      cwd: appDirectory,
      env,
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
