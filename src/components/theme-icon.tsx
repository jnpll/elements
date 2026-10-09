"use client";

import type { CSSProperties } from "react";
import { themes } from "@/collections/themes";
import { useDesignTheme } from "@/components/theme-provider";

export function ThemeIcon() {
  const { selection } = useDesignTheme();
  const theme = themes.find(theme => theme.id === selection.theme)!;
  return <span className="brand-icon block shrink-0 w-[23px] h-[23px] bg-current max-[700px]:w-5 max-[700px]:h-5 max-[380px]:hidden" role="img" aria-label={`${theme.name} app icon`} style={{ "--brand-icon": `url("${theme.icon}")` } as CSSProperties} />;
}
