import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { elementSlots } from "@/lib/periodic-table";
import { themes } from "@/collections/themes";

describe("theme collections", () => {
  it("stores Alpha with a neutral palette and a replaceable icon", () => {
    expect(themes[0]).toMatchObject({ id: "alpha", initial: "A", icon: null, element: 1, defaultPalette: "neutral" });
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
  it("renders only Alpha as an occupied tile and leaves other tiles empty", () => {
    const { container } = render(<Home />);
    expect(screen.getByRole("link", { name: "Explore Alpha theme" })).toHaveAttribute("href", "/themes/alpha");
    expect(screen.getByRole("link", { name: "Explore Alpha theme" }).textContent).toBe("A");
    expect(screen.getByRole("img", { name: "Alpha icon" })).toHaveTextContent("A");
    const empty = container.querySelectorAll("[data-element]");
    expect(empty).toHaveLength(117);
    for (const tile of empty) expect(tile).toHaveTextContent(/^$/);
  });
});
