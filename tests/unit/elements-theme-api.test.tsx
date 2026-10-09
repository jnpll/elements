import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ElementsThemeProvider, useElementsTheme } from "@jnpll/elements-ui/theme-provider";
import { getElementsThemeScript, resolveThemeSelection, type ElementsTheme } from "@jnpll/elements-ui/themes";

const themes: ElementsTheme[] = [{ id: "custom", name: "Custom", defaultPalette: "one", palettes: ["one", "two"].map(id => ({ id, name: id, stylesheet: "custom.css", modes: ["light", "dark"] })) }];
function Controls() {
  const { selection, setTheme } = useElementsTheme();
  return <button onClick={() => setTheme({ theme: "custom", palette: "two" })}>{selection.palette}</button>;
}
afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.elementsTheme;
  delete document.documentElement.dataset.elementsPalette;
  document.documentElement.classList.remove("dark");
});
it("supports a custom registry, defaults, and isolated persistence", () => {
  localStorage.setItem("another-app", JSON.stringify({ theme: "custom", palette: "two" }));
  render(<ElementsThemeProvider themes={themes} storageKey="this-app" defaultSelection={{ theme: "custom", palette: "one" }}><Controls /></ElementsThemeProvider>);
  fireEvent.click(screen.getByRole("button", { name: "one" }));
  expect(JSON.parse(localStorage.getItem("this-app")!)).toEqual({ theme: "custom", palette: "two" });
  fireEvent(window, new StorageEvent("storage", { key: "another-app", newValue: null }));
  expect(screen.getByRole("button", { name: "two" })).toBeInTheDocument();
  fireEvent(window, new StorageEvent("storage", { key: "this-app", newValue: null }));
  expect(screen.getByRole("button", { name: "one" })).toBeInTheDocument();
});
it("can disable storage while leaving appearance mode unchanged", () => {
  document.documentElement.classList.add("dark");
  const get = vi.spyOn(Storage.prototype, "getItem");
  const set = vi.spyOn(Storage.prototype, "setItem");
  render(<ElementsThemeProvider themes={themes} persist={false}><Controls /></ElementsThemeProvider>);
  fireEvent.click(screen.getByRole("button", { name: "one" }));
  expect(get).not.toHaveBeenCalled();
  expect(set).not.toHaveBeenCalled();
  expect(document.documentElement).toHaveClass("dark");
});
it("validates unknown selections and rejects empty registries", () => {
  expect(resolveThemeSelection({ theme: "custom", palette: "missing" }, themes)).toEqual({ theme: "custom", palette: "one" });
  expect(() => resolveThemeSelection(null, [])).toThrow("valid default palettes");
});
it("restores selections before paint and escapes inline-script input", () => {
  localStorage.setItem("app", JSON.stringify({ theme: "custom", palette: "two" }));
  const script = getElementsThemeScript({ themes, storageKey: "app" });
  new Function(script)();
  expect(document.documentElement.dataset.elementsPalette).toBe("two");
  localStorage.setItem("app", "invalid");
  new Function(script)();
  expect(document.documentElement.dataset.elementsPalette).toBe("one");
  expect(getElementsThemeScript({ storageKey: "</script>" })).not.toContain("</script>");
  const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw Error("blocked"); });
  new Function(script)();
  expect(document.documentElement.dataset.elementsPalette).toBe("one");
  read.mockClear();
  new Function(getElementsThemeScript({ themes, persist: false }))();
  expect(read).not.toHaveBeenCalled();
});
