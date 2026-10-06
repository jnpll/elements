// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));

describe("published library dependency", () => {
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
