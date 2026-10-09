import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { themes } from "@/collections/themes";
import { loadThemeColors } from "@/lib/theme-colors";
import { parsePaletteColors } from "@/lib/palette-colors";
import { PaletteColors } from "@/components/palette-colors";
import { PalettePicker } from "@/components/palette-picker";
import { ThemeProvider } from "@/components/theme-provider";

describe("palette documentation", () => {
  it("reads every palette from the actual stylesheets", async () => {
    for (const theme of themes) {
      const palettes = await loadThemeColors(theme);
      expect(palettes).toHaveLength(theme.palettes.length);
      for (const palette of palettes) {
        expect(Object.keys(palette.light)).toEqual(Object.keys(palette.dark));
        expect(palette.light["--primary"]).toBeTruthy();
        expect(palette.dark["--primary"]).toBeTruthy();
        expect(palette.light).not.toHaveProperty("--radius");
      }
    }
  });
  it("preserves expressions, aliases, and complete Britanniae CSS", async () => {
    const [arthur] = await loadThemeColors(themes[1]);
    expect(arthur.light["--primary"]).toBe("#a52b37");
    expect(arthur.dark["--primary"]).toBe("#e1be67");
    expect(arthur.light["--card-foreground"]).toBe("var(--foreground)");
    expect(arthur.light["--secondary"]).toBe("color-mix(in srgb, #a52b37, white 92%)");
    expect(arthur.css).toContain('[data-elements-theme="britanniae"]');
  });
  it("filters mappings, geometry, and component-local declarations", () => {
    const palette = parsePaletteColors('@theme { --color-primary: var(--primary); } :root { --primary: white; --radius: 4px; --elements-font-sans: Arial; } .dark { --primary: black; } .demo { --primary: red; }', "neutral", "Neutral");
    expect(palette.light).toEqual({ "--primary": "white" });
    expect(palette.dark).toEqual({ "--primary": "black" });
    expect(palette.css).toContain(":root {");
    expect(palette.css).not.toContain("--radius");
    expect(() => parsePaletteColors(":root { --primary: white; }", "missing", "Missing")).toThrow("Missing color modes");
  });
  it("shows light/dark tokens independently of the app appearance", async () => {
    const palettes = await loadThemeColors(themes[1]);
    render(<ThemeProvider><PaletteColors themeId="britanniae" defaultPalette="arthur" palettes={palettes} /></ThemeProvider>);
    const light = screen.getByLabelText("Arthur light color tokens");
    expect(within(light).getAllByText("#a52b37").length).toBeGreaterThan(0);
    expect(light.querySelector('[data-color-token="--primary"]')?.parentElement?.style.getPropertyValue("--primary")).toBe("#a52b37");
    await userEvent.click(screen.getByRole("tab", { name: "Dark" }));
    const dark = screen.getByLabelText("Arthur dark color tokens");
    expect(within(dark).getAllByText("#e1be67").length).toBeGreaterThan(0);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    await userEvent.click(screen.getByText("Arthur CSS", { exact: true }));
    expect(screen.getByRole("button", { name: "Copy code" })).toBeVisible();
  });
  it("follows palette selection without replacing light/dark mode", async () => {
    const palettes = await loadThemeColors(themes[1]);
    render(<ThemeProvider><PalettePicker themeId="britanniae" /><PaletteColors themeId="britanniae" defaultPalette="arthur" palettes={palettes} /></ThemeProvider>);
    await userEvent.click(screen.getByRole("tab", { name: "Dark" }));
    await userEvent.click(screen.getByRole("button", { name: "Merlin" }));
    expect(screen.getByLabelText("Merlin dark color tokens")).toBeVisible();
    expect(screen.getByRole("tab", { name: "Dark" })).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByLabelText("Merlin dark color tokens")).getAllByText("#e4c65b").length).toBeGreaterThan(0);
  });
});
