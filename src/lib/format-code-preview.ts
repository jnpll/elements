type PreviewParser = "babel" | "typescript" | "css" | "scss" | "less" | "html" | "json" | "jsonc" | "markdown" | "mdx" | "yaml" | "graphql";

function parserForLabel(label: string): PreviewParser | null {
  const extension = label.toLowerCase().trim().split(".").pop();
  switch (extension) {
    case "js": case "jsx": case "mjs": case "cjs": return "babel";
    case "ts": case "tsx": case "mts": case "cts": return "typescript";
    case "css": case "scss": case "less": return extension;
    case "html": case "svg": return "html";
    case "json": case "jsonc": return extension;
    case "md": case "markdown": return "markdown";
    case "mdx": return "mdx";
    case "yml": case "yaml": return "yaml";
    case "gql": case "graphql": return "graphql";
    default: return null;
  }
}

async function pluginsFor(parser: PreviewParser) {
  switch (parser) {
    case "babel": return [(await import("prettier/plugins/babel")).default, (await import("prettier/plugins/estree")).default];
    case "typescript": return [(await import("prettier/plugins/typescript")).default, (await import("prettier/plugins/estree")).default];
    case "json": case "jsonc": return [(await import("prettier/plugins/babel")).default, (await import("prettier/plugins/estree")).default];
    case "css": case "scss": case "less": return [(await import("prettier/plugins/postcss")).default];
    case "html": return [(await import("prettier/plugins/html")).default];
    case "markdown": case "mdx": return [(await import("prettier/plugins/markdown")).default];
    case "yaml": return [(await import("prettier/plugins/yaml")).default];
    case "graphql": return [(await import("prettier/plugins/graphql")).default];
  }
}

export async function formatCodePreview(code: string, label: string): Promise<string> {
  const parser = parserForLabel(label);
  if (!parser) return code;
  try {
    const [prettier, plugins] = await Promise.all([import("prettier/standalone"), pluginsFor(parser)]);
    return await prettier.format(code, { parser, plugins, printWidth: 80, tabWidth: 2, semi: true, singleQuote: false });
  } catch {
    // A partial or unsupported example should stay available verbatim.
    return code;
  }
}
