import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ComponentPreview } from "@/components/component-preview";
import type { Options } from "@/lib/catalog";

vi.mock("@/components/sample", () => ({ Sample: ({ id, options, onAction }: { id: string; options: Options; onAction: () => void }) => <button data-testid="sample" disabled={options.disabled} onClick={onAction}>{id}: {options.text}</button> }));

describe("component preview", () => {
  it("updates generated code and resets properties and activation count", () => {
    const { container } = render(<ComponentPreview id="button" />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle properties" }));
    fireEvent.change(screen.getByLabelText("Label", { exact: true }), { target: { value: "Publish" } });
    fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "outline" } });
    fireEvent.click(screen.getByTestId("sample"));
    expect(screen.getByText("Activated 1 time")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sample"));
    expect(screen.getByText("Activated 2 times")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Code" }));
    expect(container.querySelector("pre code")).toHaveTextContent('variant="outline"');
    expect(container.querySelector("pre code")).toHaveTextContent("Publish");
    fireEvent.click(screen.getByRole("tab", { name: "Preview" }));
    fireEvent.click(screen.getByRole("switch", { name: "Disabled" }));
    expect(screen.getByTestId("sample")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reset properties" }));
    expect(screen.getByLabelText("Label", { exact: true })).toHaveValue("Continue");
    expect(screen.getByTestId("sample")).toBeEnabled();
    expect(screen.queryByText(/Activated/)).not.toBeInTheDocument();
  });
  it("hides properties by default and preserves them when toggled", () => {
    render(<ComponentPreview id="button" />);
    expect(screen.queryByLabelText("Label", { exact: true })).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Toggle properties" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.change(screen.getByLabelText("Label", { exact: true }), { target: { value: "Custom" } });
    fireEvent.click(toggle);
    expect(screen.queryByLabelText("Label", { exact: true })).not.toBeInTheDocument();
    expect(screen.getByTestId("sample")).toHaveTextContent("Custom");
    fireEvent.click(toggle);
    expect(screen.getByLabelText("Label", { exact: true })).toHaveValue("Custom");
  });
  it("toggles preview width without changing properties", () => {
    const { container } = render(<ComponentPreview id="button" />);
    fireEvent.click(screen.getByRole("button", { name: "Mobile-width preview" }));
    expect(container.querySelector(".preview-sample")).toHaveClass("narrow");
    expect(screen.getByRole("button", { name: "Mobile-width preview" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Full-width preview" }));
    expect(container.querySelector(".preview-sample")).not.toHaveClass("narrow");
  });
  it("avoids layering the default dot pattern under the pattern component demo", () => {
    const { container } = render(<ComponentPreview id="pattern" />);
    expect(container.querySelector(".preview-stage")).toHaveAttribute("data-slot", "pattern");
    expect(container.querySelector(".preview-stage")).toHaveAttribute("data-pattern", "none");
  });
});
