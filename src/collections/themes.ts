import { elementsThemes } from "@jnpll/elements-ui/themes";
export { defaultThemeSelection as defaultSelection, resolveThemeSelection as resolveSelection, elementsThemeStorageKey as selectionStorageKey, type ElementsThemeSelection as ThemeSelection } from "@jnpll/elements-ui/themes";
const alpha = elementsThemes.find(theme => theme.id === "alpha")!;
const britanniae = elementsThemes.find(theme => theme.id === "britanniae")!;
const cosmo = elementsThemes.find(theme => theme.id === "cosmo")!;
const pantheon = elementsThemes.find(theme => theme.id === "pantheon")!;
import { alphaIcon, crown2BoldIcon, ringedPlanetIcon, pantheonFilledIcon } from "@jnpll/elements-ui/icons";

const pantheonInitials: Record<string, string> = {
  apollo: "Ap", artemis: "At", loki: "Lo", freya: "Fr", ishtar: "It",
  shiva: "Sh", kali: "Ka", hades: "Ha", "amun-ra": "Am", anubis: "An",
  osiris: "Os", horus: "Ho", isis: "Is",
};

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
  id: britanniae.id, name: britanniae.name, initial: "B", icon: crown2BoldIcon, element: 4,
  defaultPalette: britanniae.defaultPalette,
  description: "Restrained heraldry. Modern craftsmanship.",
  palettes: britanniae.palettes.map(palette => ({ ...palette, element: palette.element!, initial: palette.name.slice(0, 2), modes: ["light", "dark"] })),
}, {
  id: cosmo.id, name: cosmo.name, initial: "C", icon: ringedPlanetIcon, element: 2,
  defaultPalette: cosmo.defaultPalette,
  description: "Celestial color on translucent panels with geometric type and quiet light.",
  palettes: cosmo.palettes.map(palette => ({ ...palette, element: palette.element!, initial: palette.name.slice(0, 2), modes: ["light", "dark"] })),
}, {
  id: pantheon.id, name: pantheon.name, initial: "P", icon: pantheonFilledIcon, element: 21,
  defaultPalette: pantheon.defaultPalette,
  description: "Monumental forms inspired by mythology.",
  palettes: pantheon.palettes.map(palette => ({ ...palette, element: palette.element!, initial: pantheonInitials[palette.id], modes: ["light", "dark"] })),
}];
