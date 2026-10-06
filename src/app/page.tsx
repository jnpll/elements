import Link from "next/link";
import type { CSSProperties } from "react";
import { themes } from "@/collections/themes";
import { elementSlots, families } from "@/lib/periodic-table";

export default function Home() {
  return <article className="theme-atlas">
    <header className="atlas-heading"><div><p className="atlas-eyebrow">The design collection</p><h1>Elements</h1></div><p className="atlas-summary">Themes with character.<br /> Palettes for every expression.</p></header>
    <div className="periodic-scroll" role="region" aria-label="Theme periodic table" tabIndex={0}>
      <div className="periodic-table">
        {Array.from({ length: 18 }, (_, i) => <span key={`group-${i}`} className="periodic-group" style={{ gridColumn: i + 1, gridRow: 1 }}>{i + 1}</span>)}
        {elementSlots.map(slot => {
          const theme = themes.find(theme => theme.element === slot.number);
          const style = { gridColumn: slot.column, gridRow: slot.row + 1, "--family-color": families[slot.family].color } as CSSProperties;
          return theme ? <Link key={slot.number} className="element-tile element-theme" href={`/themes/${theme.id}`} style={style} aria-label={`Explore ${theme.name} theme`}><span className="theme-initial" role="img" aria-label={`${theme.name} icon`}>{theme.initial}</span></Link> : <div key={slot.number} className="element-tile" style={style} aria-hidden="true" data-element={slot.number} />;
        })}
        {[{ row: 7, family: "lanthanide" }, { row: 8, family: "actinide" }].map(slot => <div key={slot.row} className="element-tile element-connector" aria-hidden="true" style={{ gridColumn: 3, gridRow: slot.row, "--family-color": families[slot.family as keyof typeof families].color } as CSSProperties} />)}
      </div>
    </div>
    <div className="periodic-legend" aria-label="Element families">{Object.entries(families).map(([id, family]) => <span key={id}><i style={{ background: family.color }} />{family.label}</span>)}</div>
    <section className="collection-index"><div><h2>Collection 01</h2><span>1 theme / 1 palette</span></div><Link href="/themes/alpha"><span className="collection-initial">A</span><div><h3>Alpha</h3><p>The original foundation.</p></div><span className="collection-palette">Neutral</span><span aria-hidden="true">&rarr;</span></Link></section>
  </article>;
}
