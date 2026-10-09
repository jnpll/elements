import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it } from "vitest";
import { ThemeSelector } from "@/components/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { selectionStorageKey } from "@/collections/themes";

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.elementsTheme;
  delete document.documentElement.dataset.elementsPalette;
  document.documentElement.classList.remove("dark");
});

it("selects and persists a palette without changing appearance, then returns to Alpha", async () => {
  const user = userEvent.setup();
  document.documentElement.classList.add("dark");
  render(<ThemeProvider><ThemeSelector /></ThemeProvider>);
  const trigger = screen.getByRole("button", { name: "Select theme and palette" });
  trigger.focus();
  await user.keyboard("{ArrowDown}");
  expect(screen.getAllByRole("menuitemradio")).toHaveLength(8);
  expect(screen.getByRole("menuitemradio", { name: "Neutral" })).toHaveAttribute("aria-checked", "true");
  await user.click(screen.getByRole("menuitemradio", { name: "Merlin" }));
  expect(document.documentElement.dataset).toMatchObject({ elementsTheme: "britanniae", elementsPalette: "merlin" });
  expect(document.documentElement).toHaveClass("dark");
  expect(JSON.parse(localStorage.getItem(selectionStorageKey)!)).toEqual({ theme: "britanniae", palette: "merlin" });
  expect(trigger).toHaveAccessibleName("Select theme and palette");
  trigger.focus();
  await user.keyboard("{ArrowDown}");
  expect(await screen.findByRole("menuitemradio", { name: "Merlin" })).toHaveAttribute("aria-checked", "true");
  await user.click(screen.getByRole("menuitemradio", { name: "Neutral" }));
  expect(document.documentElement.dataset.elementsTheme).toBe("alpha");
});

it("reflects theme changes from other selectors and closes with Escape", async () => {
  const user = userEvent.setup();
  render(<ThemeProvider><ThemeSelector /></ThemeProvider>);
  fireEvent(window, new StorageEvent("storage", { key: selectionStorageKey, newValue: JSON.stringify({ theme: "britanniae", palette: "arthur" }) }));
  const trigger = screen.getByRole("button", { name: "Select theme and palette" });
  trigger.focus();
  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitemradio", { name: "Arthur" })).toHaveAttribute("aria-checked", "true");
  await user.keyboard("{Escape}");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
});
