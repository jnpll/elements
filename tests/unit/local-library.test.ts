// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { useElementsUi } from "../../scripts/use-elements-ui.mjs";

// CI checks out only Elements; local-install tests supply their own library manifest.
vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    readFileSync: vi.fn((...args: Parameters<typeof actual.readFileSync>) => {
      if (String(args[0]).replaceAll("\\", "/").endsWith("/elements-ui/package.json")) {
        return JSON.stringify({ name: "@jnpll/elements-ui" });
      }
      return actual.readFileSync(...args);
    }),
  };
});

describe("opt-in library installation", () => {
  function runner() {
    return vi.fn((_command: string, args: string[]) => args[0] === "pack"
      ? JSON.stringify([{ filename: "elements-ui.tgz" }]) : undefined);
  }

  it("builds and copies a local snapshot without changing manifests or the lockfile", () => {
    const run = runner();
    const installLocal = vi.fn();
    useElementsUi("local", run, installLocal);
    expect(run.mock.calls.map(([, args]) => args[0])).toEqual(["run"]);
    expect(run.mock.calls[0][1]).toEqual(["run", "build"]);
    expect(installLocal).toHaveBeenCalledOnce();
  });

  it("restores the pinned registry release without building the sibling", () => {
    const run = runner();
    useElementsUi("published", run);
    expect(run.mock.calls.map(([, args]) => args[0])).toEqual(["pack", "install"]);
    const version = JSON.parse(readFileSync("package.json", "utf8")).dependencies["@jnpll/elements-ui"];
    expect(run.mock.calls[0][1]).toContain(`@jnpll/elements-ui@${version}`);
  });

  it("does not install after a failed build", () => {
    const run = vi.fn(() => { throw new Error("Build failed"); });
    const installLocal = vi.fn();
    expect(() => useElementsUi("local", run, installLocal)).toThrow("Build failed");
    expect(run).toHaveBeenCalledTimes(1);
    expect(installLocal).not.toHaveBeenCalled();
  });

  it("rejects a sibling checkout with the wrong package name", () => {
    vi.mocked(readFileSync).mockReturnValueOnce("{}").mockReturnValueOnce(JSON.stringify({ name: "another-library" }));
    const run = runner();
    expect(() => useElementsUi("local", run)).toThrow("Expected @jnpll/elements-ui");
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects invalid modes before running commands", () => {
    const run = runner();
    expect(() => useElementsUi("other", run)).toThrow("Usage:");
    expect(run).not.toHaveBeenCalled();
  });

  it("reports the installed source without building or installing", () => {
    const run = runner();
    useElementsUi("status", run);
    expect(run).not.toHaveBeenCalled();
  });
});
