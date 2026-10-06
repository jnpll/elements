"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, GitFork, Layers, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@jnpll/elements-ui/tooltip";
import { catalog } from "@/lib/catalog";

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const matches = catalog.filter(({ name, group }) => `${name} ${group}`.toLowerCase().includes(query.toLowerCase()));
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("elements-docs-theme", dark ? "dark" : "light"); } catch {}
  }
  return <TooltipProvider>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Button className="mobile-menu" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X /> : <Menu />}</Button>
      <Link className="brand" href="/components/button" onClick={() => setOpen(false)}><Layers size={23} strokeWidth={1.7} /><span>elements<span className="brand-dot">.</span></span><span className="version">UI / 0.2</span></Link>
      <nav className="top-nav" aria-label="Main"><Link className={path !== "/playground" ? "active" : ""} href="/components/button">Documentation</Link><Link className={path === "/playground" ? "active" : ""} href="/playground">Playground</Link></nav>
      <div className="header-tools">
        <a className="icon-link" href="https://github.com/jnpll/elements-ui" target="_blank" rel="noreferrer" title="GitHub repository" aria-label="GitHub repository"><GitFork size={18} /></a>
        <Tooltip><TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" />}><Sun className="sun-icon" /><Moon className="moon-icon" /></TooltipTrigger><TooltipContent>Toggle theme</TooltipContent></Tooltip>
      </div>
    </header>
    {open && <button className="nav-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Documentation navigation">
      <div className="sidebar-inner">
        <label className="search-box"><Search size={16} /><input type="search" placeholder="Find a component..." aria-label="Find a component" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <div className="nav-label">Start here</div>
        <Link onClick={() => setOpen(false)} className={`side-link ${path === "/getting-started" ? "selected" : ""}`} href="/getting-started">Installation</Link>
        <Link onClick={() => setOpen(false)} className={`side-link ${path === "/tokens" ? "selected" : ""}`} href="/tokens">Theme & tokens</Link>
        <Link onClick={() => setOpen(false)} className={`side-link ${path === "/playground" ? "selected" : ""}`} href="/playground">Playground <ArrowUpRight size={14} /></Link>
        <div className="nav-label component-label">Components <span>{catalog.length.toString().padStart(2, "0")}</span></div>
        {[...new Set(matches.map((item) => item.group))].map((group) => <div key={group}><div className="nav-label">{group}</div>{matches.filter((item) => item.group === group).sort((a, b) => a.name.localeCompare(b.name)).map(({ id, name }) => <Link key={id} onClick={() => setOpen(false)} className={`side-link ${path === `/components/${id}` ? "selected" : ""}`} href={`/components/${id}`}>{name}</Link>)}</div>)}
        {matches.length === 0 && <p className="empty-search">No matching components.</p>}
        <div className="sidebar-footer"><span className="status-dot" /><span>Built with Elements UI</span></div>
      </div>
    </aside>
    <main id="main" className={`main ${path === "/playground" ? "main-wide" : ""}`}>{children}<footer className="page-footer"><span>Elements UI</span><a href="https://github.com/jnpll/elements-ui" target="_blank" rel="noreferrer">Source on GitHub <ArrowUpRight size={13} /></a></footer></main>
  </TooltipProvider>;
}
