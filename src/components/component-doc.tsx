"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, Code2 } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { Badge } from "@jnpll/elements-ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@jnpll/elements-ui/tabs";
import { catalog, defaultOptions, getComponent, sampleCode, type ComponentId } from "@/lib/catalog";
import { Sample } from "./sample";
import { CodeBlock } from "./code-block";
import { extraCatalog } from "@/lib/extra-catalog";

export function ComponentDoc({ id }: { id: ComponentId }) {
  const info = getComponent(id);
  const options = defaultOptions(id);
  const extra = extraCatalog.find((item) => item.id === id);
  const [actions, setActions] = useState(0);
  const index = catalog.findIndex((item) => item.id === id);
  return <div className="doc-layout"><article className="doc-content">
    <div className="breadcrumb">Components <span>/</span> {info.group}</div>
    <div className="title-row"><h1 id="overview">{info.name}</h1><Badge variant="outline">{id === "glass-panel" || id === "card" ? "Elements" : "Base UI"}</Badge></div>
    <p className="intro">{info.description}</p>
    <div className="page-actions"><Link className="text-link" href={`/playground?component=${id}`}><Box size={15} />Open in playground <ArrowUpRight size={14} /></Link><a className="text-link muted-link" href={`https://github.com/jnpll/elements-ui/blob/main/src/components/${id}.tsx`} target="_blank" rel="noreferrer"><Code2 size={15} />Source</a></div>
    <section id="preview" className="doc-section first-section">
      <Tabs defaultValue="preview" className="example-tabs"><div className="example-toolbar"><TabsList variant="line"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><span className="live-label"><span className="status-dot" />Live component</span></div>
        <TabsContent value="preview"><div className="preview-stage"><Sample id={id} options={options} onAction={() => setActions((v) => v + 1)} /></div>{id === "button" && <div className="preview-feedback" aria-live="polite">{actions ? `Activated ${actions} ${actions === 1 ? "time" : "times"}` : "Ready"}</div>}</TabsContent>
        <TabsContent value="code"><CodeBlock code={sampleCode(id, options)} /></TabsContent>
      </Tabs>
    </section>
    <section id="usage" className="doc-section"><div className="section-heading"><h2>Usage</h2><span>Package export</span></div><CodeBlock code={sampleCode(id, options)} /></section>
    <section id="examples" className="doc-section"><h2>Examples</h2><div className="example-description">{extra ? (extra.examples > 1 ? "Disabled state" : "Default composition") : id === "button" || id === "badge" ? "Variants" : id === "glass-panel" ? "Strong surface with a ring" : id === "tabs" ? "Line tabs" : id === "card" ? "Compact spacing" : id === "tooltip" ? "Bottom placement" : id === "separator" ? "Vertical orientation" : "Scrollable content"}</div><div className="variants-stage">
      {id === "button" || id === "badge" ? (["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((variant) => <div className="variant-example" key={variant}><Sample id={id} options={{ ...options, variant, text: variant[0].toUpperCase() + variant.slice(1) }} /><code>{variant}</code></div>) : extra && extra.examples === 1 ? <CodeBlock code={sampleCode(id, options)} /> : <Sample id={id} options={{ ...options, example: extra && extra.examples > 1 ? 1 : 0, strong: true, ring: true, tabVariant: "line", size: "sm", side: "bottom", orientation: id === "separator" ? "vertical" : "horizontal" }} />}
    </div></section>
    <section id="api" className="doc-section"><h2>API Reference</h2><div className="table-scroll"><table><thead><tr><th>Prop</th><th>Type / description</th><th>Default</th></tr></thead><tbody>{info.props.map((p) => <tr key={p.name}><td><code>{p.name}</code></td><td><code>{p.type}</code><p>{p.description}</p></td><td><code>{p.default}</code></td></tr>)}</tbody></table></div></section>
    <section id="notes" className="doc-section"><h2>Composition & accessibility</h2><p className="body-copy">{info.note}</p></section>
    <nav className="component-pagination" aria-label="Adjacent components">{index > 0 ? <Link href={`/components/${catalog[index - 1].id}`}><ArrowLeft size={16} /><span><small>Previous</small>{catalog[index - 1].name}</span></Link> : <Link href="/getting-started"><ArrowLeft size={16} /><span><small>Start here</small>Installation</span></Link>}{index < catalog.length - 1 && <Link href={`/components/${catalog[index + 1].id}`}><span><small>Next component</small>{catalog[index + 1].name}</span><ArrowRight size={16} /></Link>}</nav>
    </article><nav className="toc" aria-label="On this page"><span>On this page</span><a href="#overview">Overview</a><a href="#preview">Preview</a><a href="#usage">Usage</a><a href="#examples">Examples</a><a href="#api">API reference</a><a href="#notes">Accessibility</a><Button nativeButton={false} render={<Link href={`/playground?component=${id}`} />} variant="outline" size="sm" className="mt-6">Playground <ArrowUpRight /></Button></nav></div>;
}
