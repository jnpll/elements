export interface ThemeCollection {
  id: string;
  name: string;
  initial: string;
  icon: string | null;
  element: number;
  defaultPalette: string;
  palettes: { id: string; name: string; stylesheet: string; modes: readonly ["light", "dark"] }[];
}

// App discovery metadata; reusable design rules and CSS live in the package.
export const themes: ThemeCollection[] = [{
  id: "alpha", name: "Alpha", initial: "A", icon: null, element: 1,
  defaultPalette: "neutral",
  palettes: [{ id: "neutral", name: "Neutral", stylesheet: "@jnpll/elements-ui/styles.css", modes: ["light", "dark"] }],
}];
