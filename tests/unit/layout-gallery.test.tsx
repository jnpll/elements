import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LayoutGallery } from "@/components/layout-gallery";
import { isLayoutId } from "@/lib/layouts";
import { ThemeProvider } from "@/components/theme-provider";

afterEach(() => { localStorage.clear(); delete document.documentElement.dataset.elementsTheme; delete document.documentElement.dataset.elementsPalette; });

describe("layout gallery", () => {
  it("validates presets", () => {
    for (const id of ["overview", "board", "settings"]) expect(isLayoutId(id)).toBe(true);
    for (const id of ["unknown", "toString", undefined]) expect(isLayoutId(id)).toBe(false);
  });
  it("filters projects, creates one, and resets sample data", () => {
    render(<ThemeProvider><LayoutGallery /></ThemeProvider>);
    fireEvent.change(screen.getByRole("textbox", { name: "Search sample projects" }), { target: { value: "missing" } });
    expect(screen.getByText("No projects found.")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search sample projects" }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "New project" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Project name" }), { target: { value: "Spring launch" } });
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));
    expect(screen.getByText("Spring launch")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Project created.");
    fireEvent.click(screen.getByRole("button", { name: "Reset sample data" }));
    expect(screen.queryByText("Spring launch")).not.toBeInTheDocument();
  });
  it("advances tasks and offers mobile previews", () => {
    render(<ThemeProvider><LayoutGallery initialLayout="board" /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Advance Explore typography" }));
    expect(within(screen.getByRole("region", { name: "In progress" })).getByText("Explore typography")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mobile layout preview" }));
    expect(screen.getByRole("region", { name: "Sample application" })).toHaveClass("sample-app-mobile");
  });
  it("edits settings, toggles preferences, and saves", () => {
    render(<ThemeProvider><LayoutGallery initialLayout="settings" /></ThemeProvider>);
    fireEvent.change(screen.getByRole("textbox", { name: "Full name" }), { target: { value: "Freya Morgan" } });
    fireEvent.click(screen.getByRole("switch", { name: "Weekly digest" }));
    expect(screen.getByRole("switch", { name: "Weekly digest" })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("status")).toHaveTextContent("Changes saved in this preview.");
  });
  it("applies the chosen theme and palette to the app", () => {
    render(<ThemeProvider><LayoutGallery /></ThemeProvider>);
    fireEvent.change(screen.getByRole("combobox", { name: "Layout theme" }), { target: { value: "britanniae" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Layout palette" }), { target: { value: "merlin" } });
    expect(document.documentElement.dataset).toMatchObject({ elementsTheme: "britanniae", elementsPalette: "merlin" });
  });
});
