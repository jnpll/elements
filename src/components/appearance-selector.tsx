"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@jnpll/elements-ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@jnpll/elements-ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@jnpll/elements-ui/tooltip";
import { appearanceMediaQuery, appearanceStorageKey, resolveAppearance, type Appearance } from "@/lib/appearance";

const options = [{ value: "light", label: "Light", Icon: Sun }, { value: "dark", label: "Dark", Icon: Moon }, { value: "system", label: "System", Icon: Monitor }] as const;

export function AppearanceSelector() {
  const [appearance, setAppearance] = useState<Appearance>("system");
  useEffect(() => {
    const restore = () => {
      try { setAppearance(resolveAppearance(localStorage.getItem(appearanceStorageKey))); } catch { setAppearance("system"); }
    };
    const storage = (event: StorageEvent) => {
      if (event.key === appearanceStorageKey || event.key === null) restore();
    };
    restore();
    window.addEventListener("storage", storage);
    return () => window.removeEventListener("storage", storage);
  }, []);
  useEffect(() => {
    const media = matchMedia(appearanceMediaQuery);
    const apply = () => document.documentElement.classList.toggle("dark", appearance === "dark" || (appearance === "system" && media.matches));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [appearance]);
  const active = options.find(option => option.value === appearance)!;
  return <DropdownMenu>
    <Tooltip><TooltipTrigger render={<DropdownMenuTrigger aria-label="Select appearance" render={<Button variant="ghost" size="icon" />} />}><active.Icon aria-hidden="true" /></TooltipTrigger><TooltipContent role="tooltip">Appearance: {active.label}</TooltipContent></Tooltip>
    <DropdownMenuContent align="end" aria-label="Appearance">
      <DropdownMenuRadioGroup value={appearance} onValueChange={value => {
        const next = resolveAppearance(value);
        setAppearance(next);
        try { localStorage.setItem(appearanceStorageKey, next); } catch {}
      }}>
        {options.map(({ value, label, Icon }) => <DropdownMenuRadioItem key={value} value={value} closeOnClick><Icon aria-hidden="true" />{label}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}
