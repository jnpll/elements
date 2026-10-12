import { describe, expect, it } from "vitest";
import { formatCodePreview } from "@/lib/format-code-preview";
import { componentIds, defaultOptions, sampleCode } from "@/lib/catalog";
import * as prettier from "prettier/standalone";
import typescript from "prettier/plugins/typescript";
import estree from "prettier/plugins/estree";

describe("code preview formatting", () => {
  it.each([
    ["tsx", "const App=()=> <Button>Save</Button>", "const App = () => <Button>Save</Button>;\n"],
    ["example.js", "const answer={value:42}", "const answer = { value: 42 };\n"],
    ["globals.css", ":root{--background:#fff}", ":root {\n  --background: #fff;\n}\n"],
    ["theme.scss", "$color:red;.card{color:$color}", "$color: red;\n.card {\n  color: $color;\n}\n"],
    ["example.html", "<main><h1>Title</h1><p>Hello</p></main>", "<main>\n  <h1>Title</h1>\n  <p>Hello</p>\n</main>\n"],
    ["data.json", '{"name":"Alpha","number":1}', '{ "name": "Alpha", "number": 1 }\n'],
    ["readme.md", "# Title\n\nHello   world", "# Title\n\nHello world\n"],
    ["guide.mdx", "# Title\n\nHello   world\n\n<Component />", "# Title\n\nHello world\n\n<Component />\n"],
    ["settings.yaml", "name: Alpha\nitems:\n- one", "name: Alpha\nitems:\n  - one\n"],
    ["query.graphql", "query Theme{viewer{id}}", "query Theme {\n  viewer {\n    id\n  }\n}\n"],
  ])("formats %s", async (label, source, expected) => {
    expect(await formatCodePreview(source, label)).toBe(expected);
  });

  it("keeps unsupported and invalid snippets available verbatim", async () => {
    expect(await formatCodePreview("echo hello", "shell")).toBe("echo hello");
    expect(await formatCodePreview("@jnpll:registry=https://npm.pkg.github.com", ".npmrc")).toBe("@jnpll:registry=https://npm.pkg.github.com");
    expect(await formatCodePreview("const =", "tsx")).toBe("const =");
  });

  it("parses every built-in component recipe as TSX", async () => {
    for (const id of componentIds) {
      const source = sampleCode(id, defaultOptions(id));
      await expect(prettier.format(source, { parser: "typescript", plugins: [typescript, estree] }), id).resolves.toContain("@jnpll/elements-ui/");
    }
  });
});
