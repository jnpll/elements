"use client";

import { themes } from "@/collections/themes";
import { useDesignTheme } from "@/components/theme-provider";
import { Button } from "@jnpll/elements-ui/button";

export function PalettePicker({ themeId }: { themeId?: string }) {
  const { selection, select } = useDesignTheme();
  const theme = themes.find(theme => theme.id === (themeId || selection.theme))!;
  return <div className="palette-picker flex flex-wrap gap-2 mt-5 mr-0 mb-7 ml-0" aria-label={`${theme.name} palettes`}>{theme.palettes.map(palette => <Button key={palette.id} variant={selection.theme === theme.id && selection.palette === palette.id ? "default" : "outline"} aria-pressed={selection.theme === theme.id && selection.palette === palette.id} onClick={() => select({ theme: theme.id, palette: palette.id })}>{palette.name}</Button>)}</div>;
}
