import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppearanceSelector } from "@/components/appearance-selector";
import { appearanceScript, appearanceStorageKey } from "@/lib/appearance";

let dark = false;
let listeners: Set<() => void>;
beforeEach(() => {
  localStorage.clear();
  dark = false;
  listeners = new Set();
  vi.stubGlobal("matchMedia", vi.fn(() => ({ get matches() { return dark; }, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) })));
});
afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); document.documentElement.classList.remove("dark"); });
async function choose(mode: string) {
  const user = userEvent.setup();
  screen.getByRole("button", { name: "Select appearance" }).focus();
  await user.keyboard("{ArrowDown}");
  await user.click(await screen.findByRole("menuitemradio", { name: mode }));
}
function systemChange(value: boolean) { act(() => { dark = value; listeners.forEach(listener => listener()); }); }

it("defaults to System and responds to OS changes", async () => {
  const { unmount } = render(<AppearanceSelector />);
  await userEvent.click(screen.getByRole("button", { name: "Select appearance" }));
  expect(screen.getAllByRole("menuitemradio")).toHaveLength(3);
  expect(screen.getByRole("menuitemradio", { name: "System" })).toHaveAttribute("aria-checked", "true");
  systemChange(true);
  expect(document.documentElement).toHaveClass("dark");
  systemChange(false);
  expect(document.documentElement).not.toHaveClass("dark");
  unmount();
  expect(listeners.size).toBe(0);
});
it("persists explicit choices, ignores OS changes, and returns to System", async () => {
  render(<AppearanceSelector />);
  await choose("Dark");
  expect(localStorage.getItem(appearanceStorageKey)).toBe("dark");
  systemChange(false);
  expect(document.documentElement).toHaveClass("dark");
  await choose("Light");
  systemChange(true);
  expect(document.documentElement).not.toHaveClass("dark");
  await choose("System");
  expect(localStorage.getItem(appearanceStorageKey)).toBe("system");
  expect(document.documentElement).toHaveClass("dark");
});
it("restores saved preferences and handles storage updates", () => {
  localStorage.setItem(appearanceStorageKey, "dark");
  render(<AppearanceSelector />);
  expect(document.documentElement).toHaveClass("dark");
  localStorage.setItem(appearanceStorageKey, "light");
  fireEvent(window, new StorageEvent("storage", { key: appearanceStorageKey }));
  expect(document.documentElement).not.toHaveClass("dark");
  localStorage.setItem(appearanceStorageKey, "invalid");
  systemChange(true);
  fireEvent(window, new StorageEvent("storage", { key: appearanceStorageKey }));
  expect(document.documentElement).toHaveClass("dark");
});
it("follows System when storage is blocked, including before paint", async () => {
  dark = true;
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw Error("blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw Error("blocked"); });
  new Function(appearanceScript)();
  expect(document.documentElement).toHaveClass("dark");
  render(<AppearanceSelector />);
  await choose("Light");
  expect(document.documentElement).not.toHaveClass("dark");
});
