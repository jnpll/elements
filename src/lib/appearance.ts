export type Appearance = "light" | "dark" | "system";
export const appearanceStorageKey = "elements-docs-theme";
export const appearanceMediaQuery = "(prefers-color-scheme: dark)";
export function resolveAppearance(value: unknown): Appearance {
  return value === "light" || value === "dark" ? value : "system";
}

export const appearanceScript = `(()=>{let preference='system';try{const saved=localStorage.getItem(${JSON.stringify(appearanceStorageKey)});if(saved==='light'||saved==='dark')preference=saved;}catch{}document.documentElement.classList.toggle('dark',preference==='dark'||(preference==='system'&&matchMedia(${JSON.stringify(appearanceMediaQuery)}).matches));})();`;
