"use client";

import type { CSSProperties } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@jnpll/elements-ui/tabs";
import { CodeBlock } from "@/components/code-block";
import { useDesignTheme } from "@/components/theme-provider";
import type { PaletteColors as PaletteColorData } from "@/lib/palette-colors";

export function PaletteColors({ themeId, defaultPalette, palettes }: { themeId: string; defaultPalette: string; palettes: PaletteColorData[] }) {
  const { selection } = useDesignTheme();
  const selectedId = selection.theme === themeId ? selection.palette : defaultPalette;
  const palette = palettes.find(palette => palette.id === selectedId)!;
  return <section className="mt-10 max-[700px]:mt-8" aria-label="Palette colors">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2>Color tokens</h2><span className="text-sm text-muted-foreground">{palette.name}</span></div>
    <Tabs defaultValue="light">
      <TabsList aria-label="Palette color mode"><TabsTrigger value="light">Light</TabsTrigger><TabsTrigger value="dark">Dark</TabsTrigger></TabsList>
      {(["light", "dark"] as const).map(mode => <TabsContent value={mode} key={mode}>
        <dl className="grid grid-cols-2 gap-x-6 max-[600px]:grid-cols-1" aria-label={`${palette.name} ${mode} color tokens`}>
          {Object.entries(palette[mode]).map(([token, value]) => <div key={token} className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 border-b border-border py-3">
            <dt className="contents"><span className="row-span-2 grid size-10 place-items-center overflow-hidden rounded border border-border bg-white" style={{ ...palette[mode], colorScheme: mode } as CSSProperties}>
              <span className="size-full" data-color-token={token} style={{ background: `var(${token})` }} />
            </span><span className="font-mono text-xs [overflow-wrap:anywhere]">{token}</span></dt>
            <dd className="col-start-2 mt-1 font-mono text-[11px] text-muted-foreground [overflow-wrap:anywhere]">{value}</dd>
          </div>)}
        </dl>
      </TabsContent>)}
    </Tabs>
    <details className="mt-6"><summary className="cursor-pointer text-sm font-medium">{palette.name} CSS</summary><div className="mt-4"><CodeBlock label={`${palette.id}.css`} code={palette.css} /></div></details>
  </section>;
}
