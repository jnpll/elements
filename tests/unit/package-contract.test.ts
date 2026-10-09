// @vitest-environment node
import { readFileSync } from "node:fs";
import { alphaIcon, crown2BoldIcon } from "@jnpll/elements-ui/icons";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));

describe("published library dependency", () => {
  it("imports icons and the Britanniae collection directly from the package", () => {
    expect(alphaIcon).toMatch(/^data:image\/svg\+xml,/);
    expect(crown2BoldIcon).toMatch(/^data:image\/svg\+xml,/);
    expect(decodeURIComponent(alphaIcon)).toContain("<svg");
    expect(decodeURIComponent(alphaIcon)).toContain('viewBox="0 0 24 24"');
    expect(decodeURIComponent(alphaIcon)).toContain('d="M3 20.5L8.341 6.152');
    expect(decodeURIComponent(crown2BoldIcon)).toContain("<svg");
    expect(readFileSync("src/collections/themes.ts", "utf8")).toContain('@jnpll/elements-ui/themes');
    expect(readFileSync("src/app/globals.css", "utf8")).toContain('@jnpll/elements-ui/themes.css');
    expect(manifest.scripts["themes:sync"]).toBeUndefined();
  });
  it("authenticates GitHub Packages using an environment variable, not a committed token", () => {
    const config = readFileSync(".npmrc", "utf8").trim().split(/\r?\n/);
    expect(config).toEqual([
      "@jnpll:registry=https://npm.pkg.github.com",
      "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}",
    ]);
  });

  it("pins elements-ui to a registry release, not a local directory", () => {
    expect(manifest.dependencies["@jnpll/elements-ui"]).toMatch(/^\d+\.\d+\.\d+$/);
    expect(lock.packages[""].dependencies["@jnpll/elements-ui"]).toBe(manifest.dependencies["@jnpll/elements-ui"]);
  });

  it("locks the package to an integrity-checked GitHub Packages download", () => {
    const entry = lock.packages["node_modules/@jnpll/elements-ui"];
    expect(entry.version).toBe(manifest.dependencies["@jnpll/elements-ui"]);
    expect(entry.resolved).toMatch(/^https:\/\/npm\.pkg\.github\.com\//);
    expect(entry.integrity).toMatch(/^sha512-/);
    expect(entry.link).not.toBe(true);
    expect(lock.packages["../elements-ui"]).toBeUndefined();
  });

  it("runs without sibling-build hooks", () => {
    for (const command of Object.values(manifest.scripts)) {
      expect(command).not.toContain("../elements-ui");
    }
  });
});
