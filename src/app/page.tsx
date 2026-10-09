import Link from "next/link";
import type { CSSProperties } from "react";
import { themes } from "@/collections/themes";
import { elementSlots, families } from "@/lib/periodic-table";
import { PaletteTile } from "@/components/palette-tile";
import { PalettePicker } from "@/components/palette-picker";

export default function Home() {
  return <article className="theme-atlas max-w-330 m-auto">
    <header className="atlas-heading flex justify-between items-end gap-6 mb-8 [&_h1]:text-[56px] [&_h1]:leading-[1.1] [&_h1]:mt-[10px] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-3 max-[760px]:mb-6 max-[760px]:[&_h1]:text-[40px]"><div><p className="atlas-eyebrow font-mono text-[11px] text-muted-foreground uppercase">The design collection</p><h1>Elements</h1></div><p className="atlas-summary text-[14px] text-muted-foreground max-[760px]:[&_br]:hidden">Themes with character.<br /> Palettes for every expression.</p></header>
    <div className="periodic-scroll w-full overflow-x-auto pt-1 pr-[3px] pb-3 pl-[3px]" role="region" aria-label="Theme periodic table" tabIndex={0}>
      <div className="periodic-table grid grid-cols-[repeat(18,_minmax(0,_1fr))] gap-[5px] min-w-220 aspect-[1.94]">
        {Array.from({ length: 18 }, (_, i) => <span key={`group-${i}`} className="periodic-group text-center font-mono text-[10px]" style={{ gridColumn: i + 1, gridRow: 1 }}>{i + 1}</span>)}
        {elementSlots.map(slot => {
          const theme = themes.find(theme => theme.palettes.some(palette => palette.element === slot.number));
          const palette = theme?.palettes.find(palette => palette.element === slot.number);
          const style = { gridColumn: slot.column, gridRow: slot.row + 1, "--family-color": families[slot.family].color } as CSSProperties;
          return theme && palette ? <PaletteTile key={slot.number} theme={theme.id} themeName={theme.name} palette={palette} style={style} /> : <div key={slot.number} className="element-tile border min-w-0 min-h-0 rounded-[3px]" style={style} aria-hidden="true" data-element={slot.number} />;
        })}
        {[{ row: 7, family: "lanthanide" }, { row: 8, family: "actinide" }].map(slot => <div key={slot.row} className="element-tile border min-w-0 min-h-0 rounded-[3px] element-connector opacity-[.4] border-dashed" aria-hidden="true" style={{ gridColumn: 3, gridRow: slot.row, "--family-color": families[slot.family as keyof typeof families].color } as CSSProperties} />)}
      </div>
    </div>
    <div className="periodic-legend flex flex-wrap gap-y-3 gap-x-[22px] mt-5 mr-0 mb-10 ml-0 [&_>_span]:inline-flex [&_>_span]:gap-[7px] [&_>_span]:items-center [&_>_span]:text-[10px] [&_i]:block [&_i]:w-[9px] [&_i]:h-[9px] [&_i]:rounded-[2px] max-[760px]:gap-y-[10px] max-[760px]:gap-x-4" aria-label="Theme families">{Object.entries(families).map(([id, family]) => {
      const collections = themes.filter(theme => theme.palettes.some(palette => elementSlots.some(slot => slot.number === palette.element && slot.family === id)));
      return <span key={id} title={family.label}><i aria-hidden="true" style={{ background: family.color }} />{collections.length ? collections.map(theme => <Link key={theme.id} href={`/themes/${theme.id}`} className="hover:underline underline-offset-4">{theme.name}</Link>) : family.label}</span>;
    })}</div>
    <PalettePicker />
    <Link className="text-link inline-flex items-center gap-[6px] text-[12px] font-medium [&:hover]:text-primary" href="/playground">Layout playground &rarr;</Link>
    <section className="collection-index border-t border-border py-6 px-0 [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:items-center [&_>_div]:mb-5 [&_h2]:text-[15px] [&_>_div_>_span]:font-mono [&_>_div_>_span]:text-[10px] [&_>_div_>_span]:text-muted-foreground [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-[18px] [&_>_a]:py-4 [&_>_a]:px-0 [&_>_a]:border-b [&_>_a]:border-border [&_p]:text-muted-foreground [&_p]:text-[12px]"><div><h2>Collections</h2><span>{themes.length} themes / {themes.reduce((count, theme) => count + theme.palettes.length, 0)} palettes</span></div>{themes.map(theme => <Link key={theme.id} href={`/themes/${theme.id}`}><span className="collection-initial grid place-items-center w-[42px] h-[42px] border border-border rounded-[4px] bg-muted text-[22px]"><span className="collection-icon block w-[26px] h-[26px] bg-current" role="img" aria-label={`${theme.name} collection icon`} style={{ "--collection-icon": `url("${theme.icon}")` } as CSSProperties} /></span><div><h3>{theme.name}</h3><p>{theme.description}</p></div><span className="collection-palette ml-auto text-muted-foreground text-[12px]">{theme.palettes.length} {theme.palettes.length === 1 ? "palette" : "palettes"}</span><span aria-hidden="true">&rarr;</span></Link>)}</section>
  </article>;
}
