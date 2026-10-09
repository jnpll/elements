"use client";

import { IconTooltip } from "@/components/icon-tooltip";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, GitFork, Menu, Search, X } from "lucide-react";
import { AppearanceSelector } from "@/components/appearance-selector";
import { ThemeIcon } from "@/components/theme-icon";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@jnpll/elements-ui/button";
import { TooltipProvider } from "@jnpll/elements-ui/tooltip";
import { catalog } from "@/lib/catalog";

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const atlas = path === "/";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const matches = catalog.filter(({ name, group }) => `${name} ${group}`.toLowerCase().includes(query.toLowerCase()));
  return <TooltipProvider>
    <a href="#main" className="skip-link fixed z-[100] top-2 left-2 py-[10px] px-4 bg-foreground text-background [transform:translateY(-150%)] [&:focus]:[transform:translateY(0)]">Skip to content</a>
    <header className="site-header fixed z-[40] top-0 left-0 right-0 h-[65px] flex items-center gap-7 py-0 px-7 bg-background border-b border-border max-[700px]:py-0 max-[700px]:px-4 max-[700px]:gap-3 max-[700px]:h-15 max-[380px]:gap-[6px] max-[380px]:px-[10px] max-[760px]:[&_.version]:hidden max-[760px]:[&_.top-nav]:gap-[10px] max-[480px]:[&_.top-nav]:hidden max-[480px]:[&_.header-tools]:ml-auto">
      <IconTooltip label={open ? "Close navigation" : "Open navigation"}><Button className="mobile-menu hidden max-[700px]:inline-flex max-[700px]:shrink-0" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X /> : <Menu />}</Button></IconTooltip>
      <Link className="brand flex items-center gap-[10px] shrink-0 [&_>_.brand-name]:text-[22px] [&_>_.brand-name]:font-semibold max-[700px]:gap-[7px] max-[700px]:[&_>_.brand-name]:text-[20px]" href="/" onClick={() => setOpen(false)}><ThemeIcon /><span className="brand-name">elements<span className="brand-dot text-primary">.</span></span><span className="version text-muted-foreground font-mono text-[10px] ml-[6px] py-1 px-[6px] border border-border rounded-[4px] max-[700px]:hidden">UI / 0.4</span></Link>
      <nav className="top-nav flex items-stretch gap-6 h-full ml-8 [&_a]:flex [&_a]:items-center [&_a]:relative [&_a]:text-muted-foreground [&_a]:text-[13px] [&_a.active]:text-foreground max-[900px]:ml-0 max-[700px]:gap-[14px] max-[700px]:ml-auto max-[700px]:[&_a]:text-[11px] max-[380px]:gap-[10px] max-[380px]:[&_a:nth-child(2)]:hidden max-[760px]:[&_a:nth-child(2)]:hidden" aria-label="Main"><Link className={atlas || path.startsWith("/themes/") ? "active" : ""} href="/">Collections</Link><Link className={!atlas && !path.startsWith("/themes/") && path !== "/playground" ? "active" : ""} href="/components/button">Documentation</Link><Link className={path === "/playground" ? "active" : ""} href="/playground">Playground</Link></nav>
      <div className="header-tools ml-auto flex gap-4 items-center max-[700px]:gap-1 max-[700px]:ml-0 max-[700px]:[&_.icon-link]:hidden">
        <IconTooltip label="GitHub repository"><a className="icon-link grid place-items-center w-8 h-8 rounded-[4px] [&:hover]:bg-muted" href="https://github.com/jnpll/elements-ui" target="_blank" rel="noreferrer" aria-label="GitHub repository"><GitFork size={18} /></a></IconTooltip>
        <ThemeSelector />
        <AppearanceSelector />
      </div>
    </header>
    {open && <button className="nav-backdrop hidden max-[700px]:block max-[700px]:fixed max-[700px]:z-[25]" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    {(!atlas || open) && <aside className={`sidebar fixed top-[65px] bottom-0 left-0 w-60 border-r border-border bg-background z-[30] overflow-y-auto max-[900px]:w-[210px] max-[700px]:top-15 max-[700px]:w-65 max-[700px]:[transform:translateX(-100%)] ${open ? "sidebar-open max-[700px]:[transform:translateX(0)]" : ""}`} aria-label="Documentation navigation">
      <div className="sidebar-inner py-7 px-5 flex flex-col min-h-full">
        <label className="search-box flex gap-2 items-center border border-border bg-card rounded-[6px] py-2 px-[10px] text-muted-foreground [&_input]:bg-transparent [&_input]:border-0 [&_input]:outline-none [&_input]:w-full [&_input]:min-w-0 [&_input]:text-foreground [&_input]:text-[12px]"><Search size={16} /><input type="search" placeholder="Find a component..." aria-label="Find a component" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <div className="nav-label text-[11px] font-semibold text-muted-foreground mt-7 mr-[10px] mb-[9px] ml-[10px]">Start here</div>
        <Link onClick={() => setOpen(false)} className={`side-link flex items-center justify-between min-h-[35px] py-[6px] px-[10px] mb-[2px] rounded-[5px] text-muted-foreground text-[13px] [&:hover]:bg-muted [&:hover]:text-foreground [&.selected]:bg-muted [&.selected]:text-primary [&.selected]:font-semibold ${path === "/getting-started" ? "selected" : ""}`} href="/getting-started">Installation</Link>
        <Link onClick={() => setOpen(false)} className={`side-link flex items-center justify-between min-h-[35px] py-[6px] px-[10px] mb-[2px] rounded-[5px] text-muted-foreground text-[13px] [&:hover]:bg-muted [&:hover]:text-foreground [&.selected]:bg-muted [&.selected]:text-primary [&.selected]:font-semibold ${path === "/tokens" ? "selected" : ""}`} href="/tokens">Theme & tokens</Link>
        <Link onClick={() => setOpen(false)} className={`side-link flex items-center justify-between min-h-[35px] py-[6px] px-[10px] mb-[2px] rounded-[5px] text-muted-foreground text-[13px] [&:hover]:bg-muted [&:hover]:text-foreground [&.selected]:bg-muted [&.selected]:text-primary [&.selected]:font-semibold ${path === "/playground" ? "selected" : ""}`} href="/playground">Playground <ArrowUpRight size={14} /></Link>
        <div className="nav-label text-[11px] font-semibold text-muted-foreground mt-7 mr-[10px] mb-[9px] ml-[10px] component-label flex justify-between [&_>_span]:font-mono [&_>_span]:text-[10px]">Components <span>{catalog.length.toString().padStart(2, "0")}</span></div>
        {[...new Set(matches.map((item) => item.group))].map((group) => <div key={group}><div className="nav-label text-[11px] font-semibold text-muted-foreground mt-7 mr-[10px] mb-[9px] ml-[10px]">{group}</div>{matches.filter((item) => item.group === group).sort((a, b) => a.name.localeCompare(b.name)).map(({ id, name }) => <Link key={id} onClick={() => setOpen(false)} className={`side-link flex items-center justify-between min-h-[35px] py-[6px] px-[10px] mb-[2px] rounded-[5px] text-muted-foreground text-[13px] [&:hover]:bg-muted [&:hover]:text-foreground [&.selected]:bg-muted [&.selected]:text-primary [&.selected]:font-semibold ${path === `/components/${id}` ? "selected" : ""}`} href={`/components/${id}`}>{name}</Link>)}</div>)}
        {matches.length === 0 && <p className="empty-search py-3 px-[10px] text-[12px] text-muted-foreground">No matching components.</p>}
        <div className="sidebar-footer flex items-center gap-[7px] text-[11px] text-muted-foreground pt-8 pr-[10px] pb-1 pl-[10px] mt-auto"><span className="status-dot inline-block w-[5px] h-[5px] rounded-full bg-primary shrink-0" /><span>Built with Elements UI</span></div>
      </div>
    </aside>}
    <main id="main" className={`main min-[1200px]:[&.main-wide]:pr-11 min-[1200px]:[&.main-wide]:pl-11 mt-[65px] mr-0 mb-0 ml-60 pt-12 pr-13 pb-0 pl-13 min-h-[calc(100vh_-_65px)] min-[1600px]:pt-14 max-[1200px]:pl-10 max-[1200px]:pr-10 max-[900px]:ml-[210px] max-[900px]:pl-7 max-[900px]:pr-7 max-[700px]:ml-0 max-[700px]:mt-15 max-[700px]:pt-7 max-[700px]:pr-5 max-[700px]:pb-0 max-[700px]:pl-5 max-[380px]:px-4 [&.main-atlas]:ml-0 [&.main-atlas]:pt-12 [&.main-atlas]:pr-10 [&.main-atlas]:pb-0 [&.main-atlas]:pl-10 max-[760px]:[&.main-atlas]:pt-7 max-[760px]:[&.main-atlas]:pr-4 max-[760px]:[&.main-atlas]:pb-0 max-[760px]:[&.main-atlas]:pl-4 ${atlas ? "main-atlas" : path === "/playground" ? "main-wide" : ""}`}>{children}<footer className="page-footer flex items-center justify-between gap-4 max-w-275 mt-16 mr-auto mb-0 ml-auto py-6 px-0 border-t border-border text-[10px] text-muted-foreground [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 max-[700px]:mt-10"><span>Elements UI</span><a href="https://github.com/jnpll/elements-ui" target="_blank" rel="noreferrer">Source on GitHub <ArrowUpRight size={13} /></a></footer></main>
  </TooltipProvider>;
}
