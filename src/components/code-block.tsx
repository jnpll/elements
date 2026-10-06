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
  return <div className="code-block"><div className="code-heading"><span>{label}</span><span className="copy-status" aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Copy unavailable" : ""}</span><Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy code" title="Copy code">{state === "copied" ? <Check /> : <Copy />}</Button></div><pre tabIndex={0}><code>{code}</code></pre></div>;
}
