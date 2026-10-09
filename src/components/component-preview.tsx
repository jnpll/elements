"use client";

import { IconTooltip } from "@/components/icon-tooltip";

import { useId, useState } from "react";
import { Monitor, RotateCcw, SlidersHorizontal, Smartphone } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@jnpll/elements-ui/tabs";
import { defaultOptions, sampleCode, type ComponentId } from "@/lib/catalog";
import { Pattern } from "@jnpll/elements-ui/pattern";
import { Sample } from "./sample";
import { Controls } from "./controls";
import { CodeBlock } from "./code-block";

export function ComponentPreview({ id }: { id: ComponentId }) {
  const [options, setOptions] = useState(() => defaultOptions(id));
  const [open, setOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [actions, setActions] = useState(0);
  const panelId = useId();
  return <Tabs defaultValue="preview" className="example-tabs component-preview gap-0 overflow-hidden rounded-[8px] border border-border">
    <div className="example-toolbar flex min-h-12 flex-wrap items-center justify-between gap-2.5 border-b border-border bg-card px-2.5 py-2 [&_[data-slot='tabs-trigger']]:px-2 [&_[data-slot='tabs-trigger']]:py-0"><TabsList variant="line" aria-label="Component preview"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><div className="preview-tools flex items-center gap-[2px]">
      <IconTooltip label="Full-width preview"><Button size="icon-sm" variant={narrow ? "ghost" : "secondary"} aria-label="Full-width preview" aria-pressed={!narrow} onClick={() => setNarrow(false)}><Monitor /></Button></IconTooltip>
      <IconTooltip label="Mobile-width preview"><Button size="icon-sm" variant={narrow ? "secondary" : "ghost"} aria-label="Mobile-width preview" aria-pressed={narrow} onClick={() => setNarrow(true)}><Smartphone /></Button></IconTooltip>
      <IconTooltip label="Toggle properties"><Button size="icon-sm" variant={open ? "secondary" : "ghost"} aria-label="Toggle properties" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}><SlidersHorizontal /></Button></IconTooltip>
      <IconTooltip label="Reset properties"><Button size="icon-sm" variant="ghost" aria-label="Reset properties" onClick={() => { setOptions(defaultOptions(id)); setActions(0); }}><RotateCcw /></Button></IconTooltip>
    </div></div>
    <div className={`component-preview-body grid grid-cols-1 [&.properties-open]:grid-cols-[minmax(0,_1fr)_200px] max-[1000px]:[&.properties-open]:grid-cols-1 ${open ? "properties-open" : ""}`}>
      <div className="component-preview-content min-w-0 [&_.code-block]:border-0 [&_.code-block]:rounded-none"><TabsContent value="preview"><Pattern pattern={id === "pattern" ? "none" : "dots"} className="preview-stage component-preview-stage flex min-h-[255px] items-center justify-center overflow-x-auto bg-background px-4 py-7 max-[700px]:min-h-60 [&_[data-slot='button']]:max-w-full [&>*]:[overflow-wrap:anywhere]"><div className={`preview-sample [&_[data-slot='button']]:max-w-full [&_>_*]:[overflow-wrap:anywhere] overflow-x-auto flex justify-center w-full min-w-0 [&.narrow]:w-80 [&.narrow]:max-w-full ${narrow ? "narrow" : ""}`}><Sample id={id} options={options} onAction={() => setActions(value => value + 1)} /></div></Pattern><div className="preview-feedback flex justify-between py-[7px] px-[14px] font-mono text-[10px] text-muted-foreground border-t border-border bg-card"><span aria-live="polite">{id === "button" && actions ? `Activated ${actions} ${actions === 1 ? "time" : "times"}` : "Ready"}</span><span>{narrow ? "320 px" : "Responsive"}</span></div></TabsContent><TabsContent value="code"><CodeBlock code={sampleCode(id, options)} /></TabsContent></div>
      {open && <aside id={panelId} className="preview-properties py-5 px-4 border-l border-border bg-card min-w-0 [&_h3]:mb-5 max-[1000px]:border-l-0 max-[1000px]:border-t max-[1000px]:border-border" aria-label="Component properties"><h3>Properties</h3><Controls id={id} options={options} onChange={patch => setOptions(current => ({ ...current, ...patch }))} /></aside>}
    </div>
  </Tabs>;
}
