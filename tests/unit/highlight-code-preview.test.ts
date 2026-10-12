import { describe, expect, it } from "vitest";
import { highlightCodePreview } from "@/lib/highlight-code-preview";

describe("code preview highlighting", () => {
  it.each([
    ["tsx", "export function Button() { return <button>Save</button>; }\n"],
    ["globals.css", ":root { --accent: #f00; }\n"],
    ["data.json", '{ "value": true }\n'],
    ["shell", "npm install @jnpll/elements-ui\n"],
  ])("highlights %s without changing its copyable text", async (label, source) => {
    const lines = await highlightCodePreview(source, label);
    expect(lines).not.toBeNull();
    expect(lines!.map(line => line.map(token => token.content).join("")).join("\n")).toBe(source);
    expect(lines!.flat().some(token => token.light !== token.dark)).toBe(true);
  });

  it("leaves unknown labels as plain text", async () => {
    expect(await highlightCodePreview("key=value", ".npmrc")).toBeNull();
  });
});
