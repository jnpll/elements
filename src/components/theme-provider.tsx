"use client";

import { useElementsTheme } from "@jnpll/elements-ui/theme-provider";
export { ElementsThemeProvider as ThemeProvider } from "@jnpll/elements-ui/theme-provider";

export function useDesignTheme() {
  const { selection, setTheme } = useElementsTheme();
  return { selection, select: setTheme };
}
