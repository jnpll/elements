import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { PalettePicker } from "@/components/palette-picker";
import { selectionStorageKey } from "@/collections/themes";
import Home from "@/app/page";
import { ThemeIcon } from "@/components/theme-icon";
import { alphaIcon, crown2BoldIcon } from "@jnpll/elements-ui/icons";

beforeEach(() => { localStorage.clear(); document.documentElement.classList.remove("dark"); });
afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.elementsTheme;
  delete document.documentElement.dataset.elementsPalette;
  document.documentElement.classList.remove("dark");
});

describe("design theme selection", () => {
  it("applies a noble-gas palette and persists it without changing dark mode", () => {
    document.documentElement.classList.add("dark");
    render(<ThemeProvider><ThemeIcon /><Home /></ThemeProvider>);
    expect(screen.getByRole("img", { name: "Alpha app icon" }).style.getPropertyValue("--brand-icon")).toContain(alphaIcon);
    fireEvent.click(screen.getByRole("button", { name: "Apply Britanniae Merlin" }));
    expect(document.documentElement.dataset).toMatchObject({ elementsTheme: "britanniae", elementsPalette: "merlin" });
    expect(screen.getByRole("img", { name: "Britanniae app icon" }).style.getPropertyValue("--brand-icon")).toContain(crown2BoldIcon);
    expect(document.documentElement).toHaveClass("dark");
    expect(JSON.parse(localStorage.getItem(selectionStorageKey)!)).toEqual({ theme: "britanniae", palette: "merlin" });
    expect(screen.getByRole("button", { name: "Apply Britanniae Merlin" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Apply Alpha Neutral" }));
    expect(document.documentElement.dataset.elementsTheme).toBe("alpha");
    expect(screen.getByRole("img", { name: "Alpha app icon" })).toBeInTheDocument();
  });
  it("restores a saved palette", () => {
    localStorage.setItem(selectionStorageKey, JSON.stringify({ theme: "britanniae", palette: "galahad" }));
    render(<ThemeProvider><PalettePicker /></ThemeProvider>);
    expect(screen.getByRole("button", { name: "Galahad" })).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.elementsPalette).toBe("galahad");
  });
  it("recovers from corrupt storage", () => {
    localStorage.setItem(selectionStorageKey, "invalid-json");
    render(<ThemeProvider><PalettePicker /></ThemeProvider>);
    expect(document.documentElement.dataset.elementsTheme).toBe("alpha");
  });
  it("still switches when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<ThemeProvider><PalettePicker themeId="britanniae" /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Mordred" }));
    expect(document.documentElement.dataset.elementsPalette).toBe("mordred");
  });
  it("syncs selections from another tab", () => {
    render(<ThemeProvider><PalettePicker /></ThemeProvider>);
    fireEvent(window, new StorageEvent("storage", { key: selectionStorageKey, newValue: JSON.stringify({ theme: "britanniae", palette: "lancelot" }) }));
    expect(document.documentElement.dataset.elementsPalette).toBe("lancelot");
  });
});
