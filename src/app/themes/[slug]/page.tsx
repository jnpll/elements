import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jnpll/elements-ui/button";
import { Badge } from "@jnpll/elements-ui/badge";
import { themes } from "@/collections/themes";
import { CodeBlock } from "@/components/code-block";
import { PalettePicker } from "@/components/palette-picker";
import { PaletteColors } from "@/components/palette-colors";
import { loadThemeColors } from "@/lib/theme-colors";

export function generateStaticParams() { return themes.map(theme => ({ slug: theme.id })); }
export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes.find(theme => theme.id === slug);
  if (!theme) notFound();
  const palettes = await loadThemeColors(theme);
  return <article className="prose-page max-w-195 m-auto [&_.doc-section_.code-block]:my-[18px] [&_.doc-section_.code-block]:mx-0"><div className="breadcrumb text-[12px] text-muted-foreground mb-5 flex items-center gap-[10px] [&_span]:opacity-[.5] max-[700px]:text-[11px] max-[700px]:mb-4"><Link href="/">Collections</Link><span>/</span>{theme.name}</div><h1>{theme.name}</h1><p className="intro text-muted-foreground text-[16px] mt-[14px] leading-[1.6] max-w-160 max-[700px]:text-[14px]">{theme.description}</p>
    <section className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>Palettes</h2><PalettePicker themeId={theme.id} /><div className="alpha-preview flex items-center gap-4 flex-wrap py-8 px-0"><Button>Continue</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Badge>{theme.name}</Badge></div></section>
    <PaletteColors themeId={theme.id} defaultPalette={theme.defaultPalette} palettes={palettes} />
    <section className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>Design formula</h2><dl className="design-formula m-0 [&_>_div]:grid [&_>_div]:grid-cols-[160px_minmax(0,_1fr)] [&_>_div]:gap-5 [&_>_div]:py-[14px] [&_>_div]:px-0 [&_>_div]:border-b [&_>_div]:border-border [&_dt]:text-muted-foreground [&_dd]:m-0 max-[760px]:[&_>_div]:grid-cols-[110px_minmax(0,_1fr)]"><div><dt>Spacing</dt><dd>4px base unit</dd></div><div><dt>Control heights</dt><dd>24 / 28 / 32 / 36px</dd></div><div><dt>Base radius</dt><dd>{theme.id === "alpha" ? "12px, scaled by component size" : "4px, crisp corners and fine inset borders"}</dd></div><div><dt>Typography</dt><dd>{theme.id === "alpha" ? "System sans and monospace" : "Georgia headings, sans-serif controls"}</dd></div><div><dt>States</dt><dd>Hover, focus, active, disabled, invalid</dd></div><div><dt>Primitives</dt><dd>Semantic HTML and Base UI</dd></div></dl></section>
    <section className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>Use this theme</h2><CodeBlock label="globals.css" code={`@import "tailwindcss";\n@import "@jnpll/elements-ui/styles.css";${theme.id === "britanniae" ? '\n@import "@jnpll/elements-ui/collections/britanniae/theme.css";' : ""}\n\n@source "../../node_modules/@jnpll/elements-ui/dist";`} />{theme.id === "britanniae" && <CodeBlock label="html" code={'<html data-elements-theme="britanniae" data-elements-palette="arthur">\n  <!-- application -->\n</html>'} />}</section>
    <div className="page-actions flex items-center gap-[22px] mt-[22px] flex-wrap"><Link className="text-link inline-flex items-center gap-[6px] text-[12px] font-medium [&:hover]:text-primary" href="/components/button">Explore components</Link><Link className="text-link inline-flex items-center gap-[6px] text-[12px] font-medium [&:hover]:text-primary" href="/playground">Open playground</Link></div>
  </article>;
}
