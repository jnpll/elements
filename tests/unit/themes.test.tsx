import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { ThemeProvider } from "@/components/theme-provider";
import { elementSlots, families } from "@/lib/periodic-table";
import { themes, resolveSelection } from "@/collections/themes";
import { alphaIcon, crown2BoldIcon, ringedPlanetIcon, pantheonFilledIcon } from "@jnpll/elements-ui/icons";

describe("theme collections", () => {
  it("links populated legend families to their themes and preserves family colors", () => {
    render(<ThemeProvider><Home /></ThemeProvider>);
    const legend = screen.getByLabelText("Theme families");
    const alpha = within(legend).getByRole("link", { name: "Alpha" });
    const britanniae = within(legend).getByRole("link", { name: "Britanniae" });
    const cosmo = within(legend).getByRole("link", { name: "Cosmo" });
    const pantheon = within(legend).getByRole("link", { name: "Pantheon" });
    expect(alpha).toHaveAttribute("href", "/themes/alpha");
    expect(britanniae).toHaveAttribute("href", "/themes/britanniae");
    expect(cosmo).toHaveAttribute("href", "/themes/cosmo");
    expect(pantheon).toHaveAttribute("href", "/themes/pantheon");
    expect(alpha.parentElement?.querySelector("i")).toHaveStyle({ background: families.nonmetal.color });
    expect(alpha.parentElement).toHaveAttribute("title", "Other nonmetals");
    expect(britanniae.parentElement?.querySelector("i")).toHaveStyle({ background: families.alkaline.color });
    expect(britanniae.parentElement).toHaveAttribute("title", "Alkaline earth metals");
    expect(cosmo.parentElement?.querySelector("i")).toHaveStyle({ background: families.noble.color });
    expect(cosmo.parentElement).toHaveAttribute("title", "Noble gases");
    expect(within(legend).queryByText("Noble gases")).not.toBeInTheDocument();
    expect(within(legend).queryByText("Other nonmetals")).not.toBeInTheDocument();
    expect(within(legend).getByText("Alkali metals")).toBeInTheDocument();
    expect(within(legend).getAllByRole("link")).toHaveLength(4);
    expect(legend.children).toHaveLength(Object.keys(families).length);
  });
  it("stores Alpha with its Base palette and a replaceable icon", () => {
    expect(themes[0]).toMatchObject({ id: "alpha", initial: "A", icon: alphaIcon, element: 1, defaultPalette: "base" });
    for (const theme of themes) expect(theme.palettes.some(palette => palette.id === theme.defaultPalette)).toBe(true);
  });
  it("has all 118 elements exactly once with no overlapping positions", () => {
    expect(elementSlots).toHaveLength(118);
    expect(new Set(elementSlots.map(slot => slot.number)).size).toBe(118);
    expect(new Set(elementSlots.map(slot => `${slot.row}:${slot.column}`)).size).toBe(118);
    expect(elementSlots.find(slot => slot.number === 1)).toMatchObject({ row: 1, column: 1, family: "nonmetal" });
    expect(elementSlots.find(slot => slot.number === 2)).toMatchObject({ row: 1, column: 18, family: "noble" });
    expect(elementSlots.filter(slot => slot.row === 9)).toHaveLength(15);
    expect(elementSlots.filter(slot => slot.row === 10)).toHaveLength(15);
  });
  it("renders all collection tiles at unique periodic-table positions", () => {
    const { container } = render(<ThemeProvider><Home /></ThemeProvider>);
    expect(screen.getByRole("img", { name: "Alpha collection icon" }).style.getPropertyValue("--collection-icon")).toContain(alphaIcon);
    expect(screen.getByRole("img", { name: "Britanniae collection icon" }).style.getPropertyValue("--collection-icon")).toContain(crown2BoldIcon);
    expect(screen.getByRole("img", { name: "Cosmo collection icon" }).style.getPropertyValue("--collection-icon")).toContain(ringedPlanetIcon);
    expect(screen.getByRole("img", { name: "Pantheon collection icon" }).style.getPropertyValue("--collection-icon")).toContain(pantheonFilledIcon);
    expect(screen.getByRole("button", { name: "Apply Alpha Base" }).textContent).toBe("A");
    expect(screen.getByRole("img", { name: "Base icon" })).toHaveTextContent("A");
    expect(themes[1].palettes.map(palette => palette.element)).toEqual([4, 12, 20, 38, 56, 88]);
    expect(themes[2].palettes.map(palette => palette.element)).toEqual([2, 10, 18, 36, 54, 86, 118]);
    expect(themes[3].palettes.map(palette => palette.element)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 39, 40, 41]);
    for (const palette of themes[1].palettes) expect(screen.getByRole("button", { name: `Apply Britanniae ${palette.name}` }).textContent).toBe(palette.initial);
    const empty = container.querySelectorAll("[data-element]");
    expect(empty).toHaveLength(91);
    for (const tile of empty) expect(tile).toHaveTextContent(/^$/);
    const positions = themes.flatMap(theme => theme.palettes.map(palette => palette.element));
    expect(new Set(positions).size).toBe(positions.length);
    const initials = themes.flatMap(theme => theme.palettes.map(palette => palette.initial));
    expect(new Set(initials).size).toBe(initials.length);
    for (const palette of themes[1].palettes) expect(palette.initial).toHaveLength(2);
  });
  it("validates persisted selections and falls back safely", () => {
    expect(resolveSelection({ theme: "britanniae", palette: "merlin" })).toEqual({ theme: "britanniae", palette: "merlin" });
    expect(resolveSelection({ theme: "britanniae", palette: "missing" }).palette).toBe("arthur");
    expect(resolveSelection({ theme: "cosmo", palette: "quasar" })).toEqual({ theme: "cosmo", palette: "quasar" });
    expect(resolveSelection({ theme: "pantheon", palette: "isis" })).toEqual({ theme: "pantheon", palette: "isis" });
    expect(resolveSelection({ theme: "britanniae", palette: "mordred" }).palette).toBe("arthur");
    expect(resolveSelection({ theme: "alpha", palette: "neutral" })).toEqual({ theme: "alpha", palette: "base" });
    for (const value of [null, "invalid", {}, { theme: "unknown" }]) expect(resolveSelection(value)).toEqual({ theme: "alpha", palette: "base" });
  });
});
