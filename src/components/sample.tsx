"use client";

import { ArrowRight, Check, Layers } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { Badge } from "@jnpll/elements-ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@jnpll/elements-ui/card";
import { GlassPanel } from "@jnpll/elements-ui/glass-panel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@jnpll/elements-ui/tabs";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@jnpll/elements-ui/tooltip";
import { Separator } from "@jnpll/elements-ui/separator";
import { ScrollArea } from "@jnpll/elements-ui/scroll-area";
import type { ComponentId, Options } from "@/lib/catalog";
import { extraExamples } from "@/lib/extra-examples";
import type { ExtraComponentId } from "@/lib/extra-catalog";

export function Sample({ id, options: o, onAction }: { id: ComponentId; options: Options; onAction?: () => void }) {
  if (id in extraExamples) {
    const examples = extraExamples[id as ExtraComponentId];
    const Demo = (examples[o.example] ?? examples[0]).component;
    return <div className={`extra-demo extra-demo-${id}`}><Demo key={o.example} /></div>;
  }
  switch (id) {
    case "button": return <Button variant={o.variant} size={o.size} disabled={o.disabled} onClick={onAction} aria-label={o.size.startsWith("icon") ? o.text || "Continue" : undefined}>{(o.icon || o.size.startsWith("icon")) && <ArrowRight />}{!o.size.startsWith("icon") && o.text}</Button>;
    case "badge": return <Badge variant={o.variant}>{o.text}</Badge>;
    case "card": return <Card size={o.size === "sm" ? "sm" : "default"} className="w-full max-w-sm"><CardHeader><CardTitle>{o.text}</CardTitle><CardDescription>Your space to make something good.</CardDescription></CardHeader><CardContent><img src="/samples/workspace.webp" alt="MacBook Pro on a clean workspace" className="mb-4 h-28 w-full rounded-md object-contain bg-white" /><p>Everything you need, in one place.</p></CardContent><CardFooter><span>Updated just now</span></CardFooter></Card>;
    case "glass-panel": return <div className="glass-backdrop"><div className="glass-backdrop-grid" aria-hidden="true"><Layers size={48} strokeWidth={1} /><span>ELEMENTS / SURFACES</span></div><GlassPanel strong={o.strong} ring={o.ring} className="w-full max-w-sm p-6"><h3 className="font-medium">{o.text}</h3><p className="mt-2 text-sm text-muted-foreground">A surface that lets the background through.</p></GlassPanel></div>;
    case "tabs": return <Tabs key={o.orientation + o.tabVariant} defaultValue="overview" orientation={o.orientation} className="w-full max-w-sm"><TabsList variant={o.tabVariant}><TabsTrigger value="overview">{o.text}</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList><TabsContent value="overview" className="py-4">Your workspace at a glance.</TabsContent><TabsContent value="activity" className="py-4"><span className="inline-flex items-center gap-2"><Check size={14} />Everything is up to date.</span></TabsContent></Tabs>;
    case "tooltip": return <TooltipProvider delay={o.delay}><Tooltip><TooltipTrigger className="sample-trigger">Hover or focus</TooltipTrigger><TooltipContent side={o.side}>{o.text}</TooltipContent></Tooltip></TooltipProvider>;
    case "separator": return o.orientation === "horizontal" ? <div className="w-full max-w-sm"><p>{o.text}</p><Separator className="my-4" /><p className="text-sm text-muted-foreground">A related section</p></div> : <div className="flex h-8 items-center gap-4"><span>{o.text}</span><Separator orientation="vertical" /><span>Settings</span></div>;
    case "scroll-area": return <ScrollArea className="h-56 w-full max-w-sm rounded-lg border"><div className="p-4"><h3 className="mb-4 font-medium">{o.text}</h3>{Array.from({ length: 18 }, (_, i) => <div key={i} className="border-b py-3 text-sm">Workspace update {i + 1}</div>)}</div></ScrollArea>;
  }
}
