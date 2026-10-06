import { CodeBlock } from "@/components/code-block";

export const metadata = { title: "Theme & tokens" };
const tokens = ["background", "foreground", "card", "primary", "secondary", "muted", "accent", "border", "ring", "destructive"];

export default function Page() {
  return <article className="prose-page"><div className="breadcrumb">Start here <span>/</span> Design foundations</div><h1>Theme & tokens</h1><p className="intro">Neutral surfaces. Clear hierarchy. A consistent vocabulary.</p>
    <section className="doc-section"><h2>Semantic colors</h2><p className="body-copy">Components use semantic CSS variables. Each token adapts to the current light or dark theme.</p><div className="token-grid">{tokens.map((token) => <div key={token} className="token-item"><div className="token-swatch" style={{ background: `var(--${token})` }} /><div><code>--{token}</code><span>{token === "foreground" ? "Text and icons" : token === "background" ? "Page surface" : `${token[0].toUpperCase()}${token.slice(1)} color`}</span></div></div>)}</div></section>
    <section className="doc-section"><h2>Dark mode</h2><CodeBlock label="html" code={'<html class="dark">\n  <!-- application -->\n</html>'} /><p className="body-copy">Toggle the document class and persist the preference in your app. The library provides the tokens; your app owns the preference.</p></section>
    <section className="doc-section"><h2>Typography</h2><p className="body-copy">Fonts are loaded by each app. Set the following variables to use your chosen families. Without them, components use system fonts.</p><CodeBlock label="css" code={':root {\n  --elements-font-sans: "Space Grotesk", sans-serif;\n  --elements-font-mono: "JetBrains Mono", monospace;\n}'} /><div className="type-specimen"><span>Aa</span><div><p>Considered in every detail.</p><code>font-sans / font-mono</code></div></div></section>
    <section className="doc-section"><h2>Radius</h2><p className="body-copy">The base radius is 0.75rem. The theme derives the Tailwind radius scale from this value.</p><CodeBlock label="css" code={':root {\n  --radius: 0.75rem;\n}'} /></section>
  </article>;
}
