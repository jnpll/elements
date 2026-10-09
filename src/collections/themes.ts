import { elementsThemes } from "@jnpll/elements-ui/themes";
export { defaultThemeSelection as defaultSelection, resolveThemeSelection as resolveSelection, elementsThemeStorageKey as selectionStorageKey, type ElementsThemeSelection as ThemeSelection } from "@jnpll/elements-ui/themes";
const alpha = elementsThemes.find(theme => theme.id === "alpha")!;
const britanniae = elementsThemes.find(theme => theme.id === "britanniae")!;
import { alphaIcon, crown2BoldIcon } from "@jnpll/elements-ui/icons";

export interface ThemePalette {
  id: string;
  name: string;
  element: number;
  initial: string;
  stylesheet: string;
  modes: readonly ["light", "dark"];
}

export interface ThemeCollection {
  id: string;
  name: string;
  initial: string;
  icon: string | null;
  element: number;
  defaultPalette: string;
  description: string;
  palettes: ThemePalette[];
}

// App discovery metadata; reusable design rules and CSS live in the package.
export const themes: ThemeCollection[] = [{
  id: "alpha", name: "Alpha", initial: "A", icon: alphaIcon, element: 1,
  defaultPalette: alpha.defaultPalette,
  description: "The original foundation.",
  palettes: alpha.palettes.map(palette => ({ ...palette, element: 1, initial: "A", modes: ["light", "dark"] })),
}, {
  id: britanniae.id, name: britanniae.name, initial: "B", icon: crown2BoldIcon, element: 2,
  defaultPalette: britanniae.defaultPalette,
  description: "Restrained heraldry. Modern craftsmanship.",
  palettes: britanniae.palettes.map(palette => ({ ...palette, element: palette.element!, initial: palette.name.slice(0, 2), modes: ["light", "dark"] })),
}];
