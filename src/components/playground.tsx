"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Monitor, RotateCcw, Smartphone } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { catalog, defaultOptions, getComponent, sampleCode, type ComponentId } from "@/lib/catalog";
import { Sample } from "./sample";
import { Controls } from "./controls";
import { CodeBlock } from "./code-block";

export function Playground({ initialId }: { initialId: ComponentId }) {
  const [id, setId] = useState(initialId);
  const [options, setOptions] = useState(defaultOptions(initialId));
  const [narrow, setNarrow] = useState(false);
  const [actions, setActions] = useState(0);
  function choose(next: ComponentId) { setId(next); setOptions(defaultOptions(next)); setActions(0); window.history.replaceState(null, "", `/playground?component=${next}`); }
  return <article className="playground-page"><div className="breadcrumb">Workspace <span>/</span> Playground</div><div className="title-row"><h1>Playground</h1><span className="live-label"><span className="status-dot" />Live</span></div><p className="intro">The real components. Your configuration.</p>
    <div className="playground-workbench">
      <aside className="properties-panel"><div className="panel-heading"><h2>Component</h2><Button variant="ghost" size="icon-sm" onClick={() => { setOptions(defaultOptions(id)); setActions(0); }} title="Reset properties" aria-label="Reset properties"><RotateCcw /></Button></div><label className="sr-only" htmlFor="component-choice">Component</label><select id="component-choice" value={id} onChange={(e) => choose(e.target.value as ComponentId)}>{catalog.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="properties-divider" /><h3>Properties</h3><Controls id={id} options={options} onChange={(patch) => setOptions((current) => ({ ...current, ...patch }))} /><Link href={`/components/${id}`} className="text-link panel-doc-link">Component reference <ArrowUpRight size={14} /></Link></aside>
      <div className="playground-canvas"><div className="canvas-toolbar"><span>{getComponent(id).name}</span><div className="viewport-switch" role="group" aria-label="Preview width"><Button variant={narrow ? "ghost" : "secondary"} size="icon-sm" title="Full-width preview" aria-label="Full-width preview" aria-pressed={!narrow} onClick={() => setNarrow(false)}><Monitor /></Button><Button variant={narrow ? "secondary" : "ghost"} size="icon-sm" title="Mobile-width preview" aria-label="Mobile-width preview" aria-pressed={narrow} onClick={() => setNarrow(true)}><Smartphone /></Button></div></div><div className="playground-preview"><div className={`playground-sample ${narrow ? "narrow" : ""}`}><Sample id={id} options={options} onAction={() => setActions((n) => n + 1)} /></div></div><div className="canvas-status"><span aria-live="polite">{id === "button" && actions ? `Activated ${actions} ${actions === 1 ? "time" : "times"}` : "@jnpll/elements-ui"}</span><span>{narrow ? "320 px" : "Responsive"}</span></div></div>
    </div>
    <section className="doc-section"><div className="section-heading"><h2>Generated code</h2><span>JSX</span></div><CodeBlock code={sampleCode(id, options)} /></section>
  </article>;
}
