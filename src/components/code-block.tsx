"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";

export function CodeBlock({ code, label = "tsx" }: { code: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(code); setState("copied"); } catch { setState("failed"); }
    window.setTimeout(() => setState("idle"), 2200);
  }
  return <div className="code-block border border-border rounded-[6px] overflow-hidden bg-card [&_pre]:m-0 [&_pre]:p-5 [&_pre]:overflow-auto [&_pre]:text-foreground [&_pre]:text-[12px] [&_pre]:leading-[1.9] [&_code]:text-[inherit] max-[700px]:[&_pre]:p-4 max-[700px]:[&_pre]:text-[11px] [&_pre]:max-h-120"><div className="code-heading flex items-center min-h-10 gap-2 pt-1 pr-[10px] pb-1 pl-4 border-b border-border [&_>_span:first-child]:font-mono [&_>_span:first-child]:text-[10px] [&_>_span:first-child]:text-muted-foreground [&_button]:ml-0"><span>{label}</span><span className="copy-status ml-auto text-[10px] text-primary" aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Copy unavailable" : ""}</span><Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy code" title="Copy code">{state === "copied" ? <Check /> : <Copy />}</Button></div><pre tabIndex={0}><code>{code}</code></pre></div>;
}
