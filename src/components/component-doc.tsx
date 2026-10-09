"use client";

import Link from "next/link";
import { IconTooltip } from "@/components/icon-tooltip";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { Badge } from "@jnpll/elements-ui/badge";
import { ComponentPreview } from "./component-preview";
import { catalog, defaultOptions, getComponent, sampleCode, type ComponentId } from "@/lib/catalog";
import { Sample } from "./sample";
import { CodeBlock } from "./code-block";
import { extraCatalog } from "@/lib/extra-catalog";

export function ComponentDoc({ id }: { id: ComponentId }) {
  const info = getComponent(id);
  const options = defaultOptions(id);
  const extra = extraCatalog.find((item) => item.id === id);
  const index = catalog.findIndex((item) => item.id === id);
  return <div className="doc-layout max-w-275 m-auto grid grid-cols-[minmax(0,_780px)_150px] gap-14 max-[1200px]:grid-cols-1 max-[1200px]:max-w-195"><article className="doc-content min-w-0">
    <div className="breadcrumb text-[12px] text-muted-foreground mb-5 flex items-center gap-[10px] [&_span]:opacity-[.5] max-[700px]:text-[11px] max-[700px]:mb-4">Components <span>/</span> {info.group}</div>
    <div className="title-row flex items-center gap-4 flex-wrap"><h1 id="overview">{info.name}</h1><Badge variant="outline">{id === "glass-panel" || id === "card" || id === "pattern" ? "Elements" : "Base UI"}</Badge></div>
    <p className="intro text-muted-foreground text-[16px] mt-[14px] leading-[1.6] max-w-160 max-[700px]:text-[14px]">{info.description}</p>
    <div className="page-actions flex items-center gap-[22px] mt-[22px] flex-wrap"><IconTooltip label="View component source on GitHub"><a className="text-link inline-flex items-center gap-[6px] text-[12px] font-medium [&:hover]:text-primary muted-link text-muted-foreground" href={`https://github.com/jnpll/elements-ui/blob/main/src/components/${id}.tsx`} target="_blank" rel="noreferrer"><Code2 size={15} />Source</a></IconTooltip></div>
    <section id="preview" className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8 first-section mt-7">
      <ComponentPreview key={id} id={id} />
    </section>
    <section id="usage" className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><div className="section-heading flex items-center justify-between gap-3 mb-4 [&_>_span]:text-[11px] [&_>_span]:text-muted-foreground"><h2>Usage</h2><span>Package export</span></div><CodeBlock code={sampleCode(id, options)} /></section>
    <section id="examples" className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>Examples</h2><div className="example-description text-[12px] text-muted-foreground mb-[14px]">{extra ? (extra.examples > 1 ? "Disabled state" : "Default composition") : id === "button" || id === "badge" ? "Variants" : id === "pattern" ? "Grid with faded edges" : id === "glass-panel" ? "Strong surface with a ring" : id === "tabs" ? "Line tabs" : id === "card" ? "Compact spacing" : id === "tooltip" ? "Bottom placement" : id === "separator" ? "Vertical orientation" : "Scrollable content"}</div><div className="variants-stage flex items-center justify-center flex-wrap gap-[22px] border border-border rounded-[6px] min-h-35 py-7 px-5 [&_>_*]:[overflow-wrap:anywhere] max-[700px]:gap-y-5 max-[700px]:gap-x-[14px]">
      {id === "button" || id === "badge" ? (["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((variant) => <div className="variant-example min-w-[82px] flex items-center flex-col gap-[14px] [&_code]:text-muted-foreground [&_code]:text-[10px] max-[700px]:min-w-[75px]" key={variant}><Sample id={id} options={{ ...options, variant, text: variant[0].toUpperCase() + variant.slice(1) }} /><code>{variant}</code></div>) : extra && extra.examples === 1 ? <CodeBlock code={sampleCode(id, options)} /> : <Sample id={id} options={{ ...options, pattern: "grid", fade: true, example: extra && extra.examples > 1 ? 1 : 0, strong: true, ring: true, tabVariant: "line", size: "sm", side: "bottom", orientation: id === "separator" ? "vertical" : "horizontal" }} />}
    </div></section>
    <section id="api" className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>API Reference</h2><div className="table-scroll w-full overflow-x-auto"><table><thead><tr><th>Prop</th><th>Type / description</th><th>Default</th></tr></thead><tbody>{info.props.map((p) => <tr key={p.name}><td><code>{p.name}</code></td><td><code>{p.type}</code><p>{p.description}</p></td><td><code>{p.default}</code></td></tr>)}</tbody></table></div></section>
    <section id="notes" className="doc-section mt-10 [&_>_h2]:mb-4 max-[700px]:mt-8"><h2>Composition & accessibility</h2><p className="body-copy text-muted-foreground text-[14px] leading-[1.8] mb-4">{info.note}</p></section>
    <nav className="component-pagination flex justify-between gap-6 mt-11 pt-6 border-t border-border [&_a]:flex [&_a]:items-center [&_a]:gap-3 [&_a]:text-[13px] [&_a:hover]:text-primary [&_a:last-child]:text-right [&_a:last-child]:ml-auto [&_small]:block [&_small]:text-muted-foreground [&_small]:text-[10px]" aria-label="Adjacent components">{index > 0 ? <Link href={`/components/${catalog[index - 1].id}`}><ArrowLeft size={16} /><span><small>Previous</small>{catalog[index - 1].name}</span></Link> : <Link href="/getting-started"><ArrowLeft size={16} /><span><small>Start here</small>Installation</span></Link>}{index < catalog.length - 1 && <Link href={`/components/${catalog[index + 1].id}`}><span><small>Next component</small>{catalog[index + 1].name}</span><ArrowRight size={16} /></Link>}</nav>
    </article><nav className="toc sticky top-27 self-start flex flex-col gap-3 pt-4 [&_>_span]:text-[11px] [&_>_span]:font-semibold [&_>_span]:mb-2 [&_a]:text-muted-foreground [&_a]:text-[11px] [&_a:hover]:text-foreground [&_>_[data-slot='button']]:text-foreground [&_>_[data-slot='button']]:self-start max-[1200px]:hidden" aria-label="On this page"><span>On this page</span><a href="#overview">Overview</a><a href="#preview">Preview</a><a href="#usage">Usage</a><a href="#examples">Examples</a><a href="#api">API reference</a><a href="#notes">Accessibility</a><Button nativeButton={false} render={<Link href="/playground" />} variant="outline" size="sm" className="mt-6">Playground <ArrowUpRight /></Button></nav></div>;
}
