import type { BundledLanguage } from "shiki/bundle/web";

export type HighlightedToken = {
  content: string;
  light: string;
  dark: string;
};

export type HighlightedLines = HighlightedToken[][];

function languageForLabel(label: string): BundledLanguage | null {
  const extension = label.toLowerCase().trim().split(".").pop();
  switch (extension) {
    case "js": case "jsx": case "ts": case "tsx": return extension;
    case "mjs": case "cjs": return "js";
    case "mts": case "cts": return "ts";
    case "css": case "scss": case "less": case "html": case "svg":
    case "json": case "jsonc": case "md": case "mdx": case "yaml":
    case "graphql": return extension === "svg" ? "xml" : extension;
    case "markdown": return "md";
    case "yml": return "yaml";
    case "gql": return "graphql";
    case "shell": case "sh": case "bash": case "zsh": return "bash";
    default: return null;
  }
}

export async function highlightCodePreview(code: string, label: string): Promise<HighlightedLines | null> {
  const lang = languageForLabel(label);
  if (!lang) return null;
  try {
    const { codeToTokensWithThemes } = await import("shiki/bundle/web");
    const lines = await codeToTokensWithThemes(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
    });
    return lines.map(line => line.map(token => ({
      content: token.content,
      light: token.variants.light.color ?? "inherit",
      dark: token.variants.dark.color ?? "inherit",
    })));
  } catch {
    return null;
  }
}
