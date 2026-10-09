import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ThemeCollection } from "@/collections/themes";
import { parsePaletteColors } from "./palette-colors";

export async function loadThemeColors(theme: ThemeCollection) {
  return Promise.all(theme.palettes.map(async palette => {
    const file = path.join(process.cwd(), "node_modules/@jnpll/elements-ui/dist/collections", theme.id, "palettes", `${palette.id}.css`);
    const css = await readFile(file, "utf8");
    const colors = parsePaletteColors(css, palette.id, palette.name);
    return { ...colors, css };
  }));
}
