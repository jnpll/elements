"use client";

import type { ComponentId, Options } from "@/lib/catalog";
import { extraCatalog } from "@/lib/extra-catalog";

const field = "control-field flex min-w-0 flex-col gap-[7px] text-xs";
const input = "min-h-[34px] w-full rounded-[5px] border border-input bg-background px-2.5 py-1.5 text-xs text-foreground";
const fields = "controls flex flex-col gap-4 max-[700px]:grid max-[700px]:grid-cols-2 max-[700px]:[&>.control-field:first-child]:col-span-full";

export function Controls({ id, options, onChange }: { id: ComponentId; options: Options; onChange: (patch: Partial<Options>) => void }) {
  const extra = extraCatalog.find((item) => item.id === id);
  if (extra) return <div className={fields}><div className={field}><label htmlFor="control-example">Example</label><select className={input} id="control-example" value={options.example} onChange={(event) => onChange({ example: Number(event.target.value) })}>{Array.from({ length: extra.examples }, (_, index) => <option key={index} value={index}>{index === 0 ? "Default" : "Disabled"}</option>)}</select></div></div>;
  function select<K extends keyof Options>(key: K, label: string, values: readonly string[]) {
    return <div className={field} key={key}><label htmlFor={`control-${key}`}>{label}</label><select className={input} id={`control-${key}`} value={String(options[key])} onChange={(e) => onChange({ [key]: e.target.value })}>{values.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>;
  }
  function toggle(key: "disabled" | "icon" | "strong" | "ring" | "fade", label: string) {
    return <label className="toggle-field flex min-h-6 cursor-pointer items-center justify-between gap-3 text-xs" key={key}><span>{label}</span><input className="relative h-4 w-7 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-muted after:absolute after:left-0.5 after:top-0.5 after:size-2.5 after:rounded-full after:bg-muted-foreground after:transition-transform after:duration-150 checked:bg-foreground checked:after:translate-x-3 checked:after:bg-background" type="checkbox" role="switch" checked={options[key]} onChange={(e) => onChange({ [key]: e.target.checked })} /></label>;
  }
  return <div className={fields}>
    <label className={field}><span>{id === "tooltip" ? "Tooltip content" : "Label"}</span><input className={input} value={options.text} maxLength={80} onChange={(e) => onChange({ text: e.target.value })} /></label>
    {(id === "button" || id === "badge") && select("variant", "Variant", ["default", "secondary", "outline", "ghost", "destructive", "link"])}
    {id === "button" && <>{select("size", "Size", ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"])}{toggle("disabled", "Disabled")}{toggle("icon", "Leading icon")}</>}
    {id === "card" && select("size", "Size", ["default", "sm"])}
    {id === "glass-panel" && <>{toggle("strong", "Strong surface")}{toggle("ring", "Gradient ring")}</>}
    {id === "pattern" && <>{select("pattern", "Pattern", ["dots", "grid", "none"])}
      <label className={field}><span className="flex justify-between">Spacing <output>{options.spacing} px</output></span><input aria-label="Spacing" className="w-full accent-foreground" type="range" min={4} max={48} step={2} value={options.spacing} onChange={e => onChange({ spacing: Number(e.target.value) })} /></label>
      <label className={field}><span className="flex justify-between">Pattern size <output>{options.patternSize} px</output></span><input aria-label="Pattern size" className="w-full accent-foreground" type="range" min={0.1} max={2} step={0.1} value={options.patternSize} onChange={e => onChange({ patternSize: Number(e.target.value) })} /></label>
      {toggle("fade", "Fade edges")}</>}
    {(id === "tabs" || id === "separator") && select("orientation", "Orientation", ["horizontal", "vertical"])}
    {id === "tabs" && select("tabVariant", "List variant", ["default", "line"])}
    {id === "tooltip" && <>{select("side", "Placement", ["top", "right", "bottom", "left"])}<label className={field}><span className="flex justify-between">Open delay <output className="text-[10px] text-muted-foreground">{options.delay} ms</output></span><input className="w-full accent-foreground" type="range" min={0} max={1000} step={100} value={options.delay} onChange={(e) => onChange({ delay: Number(e.target.value) })} /></label></>}
  </div>;
}
