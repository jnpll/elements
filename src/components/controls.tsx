"use client";

import type { ComponentId, Options } from "@/lib/catalog";
import { extraCatalog } from "@/lib/extra-catalog";

export function Controls({ id, options, onChange }: { id: ComponentId; options: Options; onChange: (patch: Partial<Options>) => void }) {
  const extra = extraCatalog.find((item) => item.id === id);
  if (extra) return <div className="controls"><div className="control-field"><label htmlFor="control-example">Example</label><select id="control-example" value={options.example} onChange={(event) => onChange({ example: Number(event.target.value) })}>{Array.from({ length: extra.examples }, (_, index) => <option key={index} value={index}>{index === 0 ? "Default" : "Disabled"}</option>)}</select></div></div>;
  function select<K extends keyof Options>(key: K, label: string, values: readonly string[]) {
    return <div className="control-field" key={key}><label htmlFor={`control-${key}`}>{label}</label><select id={`control-${key}`} value={String(options[key])} onChange={(e) => onChange({ [key]: e.target.value })}>{values.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>;
  }
  function toggle(key: "disabled" | "icon" | "strong" | "ring", label: string) {
    return <label className="toggle-field" key={key}><span>{label}</span><input type="checkbox" role="switch" checked={options[key]} onChange={(e) => onChange({ [key]: e.target.checked })} /></label>;
  }
  return <div className="controls">
    <label className="control-field"><span>{id === "tooltip" ? "Tooltip content" : "Label"}</span><input value={options.text} maxLength={80} onChange={(e) => onChange({ text: e.target.value })} /></label>
    {(id === "button" || id === "badge") && select("variant", "Variant", ["default", "secondary", "outline", "ghost", "destructive", "link"])}
    {id === "button" && <>{select("size", "Size", ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"])}{toggle("disabled", "Disabled")}{toggle("icon", "Leading icon")}</>}
    {id === "card" && select("size", "Size", ["default", "sm"])}
    {id === "glass-panel" && <>{toggle("strong", "Strong surface")}{toggle("ring", "Gradient ring")}</>}
    {(id === "tabs" || id === "separator") && select("orientation", "Orientation", ["horizontal", "vertical"])}
    {id === "tabs" && select("tabVariant", "List variant", ["default", "line"])}
    {id === "tooltip" && <>{select("side", "Placement", ["top", "right", "bottom", "left"])}<label className="control-field"><span>Open delay <output>{options.delay} ms</output></span><input type="range" min={0} max={1000} step={100} value={options.delay} onChange={(e) => onChange({ delay: Number(e.target.value) })} /></label></>}
  </div>;
}
