"use client";

import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { formatCodePreview } from "@/lib/format-code-preview";
import { highlightCodePreview, type HighlightedLines } from "@/lib/highlight-code-preview";

type RenderedCode = { code: string; label: string; text: string };
type HighlightedCode = RenderedCode & { lines: HighlightedLines | null };

export function CodeBlock({ code, label = "tsx" }: { code: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [formatted, setFormatted] = useState<RenderedCode | null>(null);
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);
  const displayCode = formatted?.code === code && formatted.label === label ? formatted.text : code;
  const displayLines = highlighted?.code === code && highlighted.label === label && highlighted.text === displayCode
    ? highlighted.lines
    : null;

  useEffect(() => {
    let active = true;
    async function renderCode() {
      const text = await formatCodePreview(code, label);
      if (!active) return;
      setFormatted({ code, label, text });
      const lines = await highlightCodePreview(text, label);
      if (active) setHighlighted({ code, label, text, lines });
    }
    void renderCode();
    return () => { active = false; };
  }, [code, label]);

  async function copy() {
    try {
      const text = formatted?.code === code && formatted.label === label ? displayCode : await formatCodePreview(code, label);
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch { setState("failed"); }
    window.setTimeout(() => setState("idle"), 2200);
  }

  return <div className="code-block border border-border rounded-[6px] overflow-hidden bg-card [&_pre]:m-0 [&_pre]:p-5 [&_pre]:overflow-auto [&_pre]:text-foreground [&_pre]:text-[12px] [&_pre]:leading-[1.9] [&_code]:text-[inherit] max-[700px]:[&_pre]:p-4 max-[700px]:[&_pre]:text-[11px] [&_pre]:max-h-120">
    <div className="code-heading flex items-center min-h-10 gap-2 pt-1 pr-[10px] pb-1 pl-4 border-b border-border [&_>_span:first-child]:font-mono [&_>_span:first-child]:text-[10px] [&_>_span:first-child]:text-muted-foreground [&_button]:ml-0">
      <span>{label}</span>
      <span className="copy-status ml-auto text-[10px] text-primary" aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Copy unavailable" : ""}</span>
      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy code" title="Copy code">{state === "copied" ? <Check /> : <Copy />}</Button>
    </div>
    <pre tabIndex={0}><code>{displayLines ? displayLines.map((line, lineIndex) => <Fragment key={lineIndex}>
      {lineIndex > 0 && "\n"}
      {line.map((token, tokenIndex) => <span key={tokenIndex} className="syntax-token" style={{ "--syntax-light": token.light, "--syntax-dark": token.dark } as CSSProperties}>{token.content}</span>)}
    </Fragment>) : displayCode}</code></pre>
  </div>;
}
