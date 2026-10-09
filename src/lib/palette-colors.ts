import postcss from "postcss";

export type ColorTokens = Record<`--${string}`, string>;
export interface PaletteColors {
  id: string;
  name: string;
  light: ColorTokens;
  dark: ColorTokens;
  css: string;
}

export function parsePaletteColors(css: string, id: string, name: string): PaletteColors {
  const light: ColorTokens = {};
  const dark: ColorTokens = {};
  postcss.parse(css).walkRules(rule => {
    // Ignore component effects and @theme mappings in the published Alpha CSS.
    if (rule.parent?.type !== "root") return;
    if (!rule.selectors.every(selector => selector === ".dark" || selector.startsWith(":root"))) return;
    const tokens = rule.selectors.some(selector => selector.includes(".dark")) ? dark : light;
    rule.walkDecls(decl => {
      if (!decl.prop.startsWith("--") || decl.prop === "--radius" || decl.prop.startsWith("--elements-font-")) return;
      tokens[decl.prop as `--${string}`] = decl.value;
    });
  });
  if (!Object.keys(light).length || !Object.keys(dark).length) throw new Error(`Missing color modes for ${name}`);
  const source = Object.entries({ light, dark }).map(([mode, tokens]) =>
    `${mode === "dark" ? ".dark" : ":root"} {\n${Object.entries(tokens).map(([token, value]) => `  ${token}: ${value};`).join("\n")}\n}`
  ).join("\n\n");
  return { id, name, light, dark, css: source };
}
