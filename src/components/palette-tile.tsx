"use client";

import { IconTooltip } from "@/components/icon-tooltip";

import type { CSSProperties } from "react";
import { useDesignTheme } from "@/components/theme-provider";
import type { ThemePalette } from "@/collections/themes";

export function PaletteTile({ theme, themeName, palette, style }: { theme: string; themeName: string; palette: ThemePalette; style: CSSProperties }) {
  const { selection, select } = useDesignTheme();
  return <IconTooltip label={`Apply ${themeName} ${palette.name}`}><button type="button" className="element-tile border min-w-0 min-h-0 rounded-[3px] element-theme relative flex flex-col justify-center items-center gap-[1px]" style={style} aria-label={`Apply ${themeName} ${palette.name}`} aria-pressed={selection.theme === theme && selection.palette === palette.id} onClick={() => select({ theme, palette: palette.id })}><span className="theme-initial text-[26px] font-semibold leading-[1]" role="img" aria-label={`${palette.name} icon`}>{palette.initial}</span></button></IconTooltip>;
}
