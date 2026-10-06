import { describe, expect, it } from "vitest";
import { catalog, componentIds, defaultOptions, getComponent, isComponentId, sampleCode } from "@/lib/catalog";
import { extraCatalog } from "@/lib/extra-catalog";

describe("component catalog", () => {
  it("has unique, complete entries for every supported component", () => {
    expect(new Set(componentIds).size).toBe(componentIds.length);
    expect(catalog.map((item) => item.id)).toEqual([...componentIds]);
    for (const id of componentIds) {
      expect(isComponentId(id)).toBe(true);
      const entry = getComponent(id);
      expect(entry).toMatchObject({ id, name: expect.any(String), group: expect.any(String) });
      expect(entry.description).not.toBe("");
      expect(entry.props.length).toBeGreaterThan(0);
      expect(defaultOptions(id).text).not.toBe("");
      expect(sampleCode(id, defaultOptions(id))).toContain("@jnpll/elements-ui/");
    }
  });

  it.each(["", "unknown", "Button", "../button", "toString"])("rejects unsupported id %j", (id) => {
    expect(isComponentId(id)).toBe(false);
  });

  it("returns fresh default options", () => {
    const first = defaultOptions("button");
    first.text = "Changed";
    first.disabled = true;
    expect(defaultOptions("button")).toMatchObject({ text: "Continue", disabled: false, example: 0 });
  });

  it("generates accessible icon-only buttons and safely quotes labels", () => {
    const options = { ...defaultOptions("button"), text: 'Say "hello" <script>', size: "icon" as const, disabled: true };
    const code = sampleCode("button", options);
    expect(code).toContain('aria-label={"Say \\"hello\\" <script>"}');
    expect(code).toContain(" disabled");
    expect(code).toContain("<ArrowRight />");
    expect(code).toContain('from "lucide-react"');
  });

  it("reflects each original component's options in the generated recipe", () => {
    expect(sampleCode("badge", { ...defaultOptions("badge"), variant: "outline" })).toContain('variant="outline"');
    expect(sampleCode("card", { ...defaultOptions("card"), size: "sm" })).toContain('size="sm"');
    expect(sampleCode("glass-panel", { ...defaultOptions("glass-panel"), strong: true, ring: true })).toContain("<GlassPanel strong ring");
    expect(sampleCode("tabs", { ...defaultOptions("tabs"), orientation: "vertical", tabVariant: "line" })).toContain('orientation="vertical"');
    expect(sampleCode("tooltip", { ...defaultOptions("tooltip"), side: "bottom", delay: 300 })).toContain("delay={300}");
    expect(sampleCode("separator", { ...defaultOptions("separator"), orientation: "vertical" })).toContain('orientation="vertical"');
    expect(sampleCode("scroll-area", defaultOptions("scroll-area"))).toContain("length: 18");
  });

  it("selects each expanded example and falls back for invalid indexes", () => {
    for (const item of extraCatalog) {
      if (!isComponentId(item.id)) throw new Error(`Unsupported example id: ${item.id}`);
      const id = item.id;
      expect(item.codes).toHaveLength(item.examples);
      item.codes.forEach((code, example) => {
        expect(sampleCode(id, { ...defaultOptions(id), example })).toBe(code);
        expect(code).not.toMatch(/@\/styles\/|@\/registry\//);
      });
      expect(sampleCode(id, { ...defaultOptions(id), example: 999 })).toBe(item.codes[0]);
    }
  });
});
