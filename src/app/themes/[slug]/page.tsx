import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jnpll/elements-ui/button";
import { Badge } from "@jnpll/elements-ui/badge";
import { themes } from "@/collections/themes";
import { CodeBlock } from "@/components/code-block";

export function generateStaticParams() { return themes.map(theme => ({ slug: theme.id })); }
export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = themes.find(theme => theme.id === slug);
  if (!theme) notFound();
  return <article className="prose-page"><div className="breadcrumb"><Link href="/">Collections</Link><span>/</span>{theme.name}</div><h1>{theme.name}</h1><p className="intro">The original Elements design. Neutral surfaces, compact controls, and restrained borders.</p>
    <section className="doc-section"><h2>Neutral</h2><p className="body-copy">The base palette, with light and dark modes.</p><div className="alpha-preview"><Button>Continue</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Badge>Alpha</Badge></div></section>
    <section className="doc-section"><h2>Design formula</h2><dl className="design-formula"><div><dt>Spacing</dt><dd>4px base unit</dd></div><div><dt>Control heights</dt><dd>24 / 28 / 32 / 36px</dd></div><div><dt>Base radius</dt><dd>12px, scaled by component size</dd></div><div><dt>Typography</dt><dd>System sans and monospace</dd></div><div><dt>States</dt><dd>Hover, focus, active, disabled, invalid</dd></div><div><dt>Primitives</dt><dd>Semantic HTML and Base UI</dd></div></dl></section>
    <section className="doc-section"><h2>Use this palette</h2><CodeBlock label="globals.css" code={`@import "tailwindcss";\n@import "${theme.palettes[0].stylesheet}";\n\n@source "../../node_modules/@jnpll/elements-ui/dist";`} /></section>
    <div className="page-actions"><Link className="text-link" href="/components/button">Explore components</Link><Link className="text-link" href="/playground?component=button">Open playground</Link></div>
  </article>;
}
