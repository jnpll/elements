import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Playground } from "@/components/playground";
import type { Options } from "@/lib/catalog";

// Test playground orchestration separately from library primitives and portals.
vi.mock("@/components/sample", () => ({
  Sample: ({ id, options, onAction }: { id: string; options: Options; onAction: () => void }) =>
    <button data-testid="sample" disabled={options.disabled} onClick={onAction}>{id}: {options.text}</button>,
}));

describe("playground state", () => {
  it("updates generated code and resets properties and activation count", () => {
    const { container } = render(<Playground initialId="button" />);
    fireEvent.change(screen.getByLabelText("Label", { exact: true }), { target: { value: "Publish" } });
    fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "outline" } });
    fireEvent.click(screen.getByTestId("sample"));
    expect(screen.getByText("Activated 1 time")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sample"));
    expect(screen.getByText("Activated 2 times")).toBeInTheDocument();
    expect(container.querySelector("pre code")).toHaveTextContent('variant="outline"');
    expect(container.querySelector("pre code")).toHaveTextContent("Publish");
    fireEvent.click(screen.getByRole("switch", { name: "Disabled" }));
    expect(screen.getByTestId("sample")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reset properties" }));
    expect(screen.getByLabelText("Label", { exact: true })).toHaveValue("Continue");
    expect(screen.getByTestId("sample")).toBeEnabled();
    expect(screen.queryByText(/Activated/)).not.toBeInTheDocument();
  });

  it("switches components, resets options, and updates the URL and reference link", () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    render(<Playground initialId="button" />);
    fireEvent.change(screen.getByLabelText("Label", { exact: true }), { target: { value: "Custom" } });
    fireEvent.click(screen.getByTestId("sample"));
    fireEvent.change(screen.getByLabelText("Component", { exact: true }), { target: { value: "badge" } });
    expect(screen.getByLabelText("Label", { exact: true })).toHaveValue("In progress");
    expect(replaceState).toHaveBeenCalledWith(null, "", "/playground?component=badge");
    expect(screen.getByRole("link", { name: /Component reference/ })).toHaveAttribute("href", "/components/badge");
    expect(screen.queryByText(/Activated/)).not.toBeInTheDocument();
  });

  it("toggles preview width without changing component properties", () => {
    const { container } = render(<Playground initialId="button" />);
    fireEvent.click(screen.getByRole("button", { name: "Mobile-width preview" }));
    expect(container.querySelector(".playground-sample")).toHaveClass("narrow");
    expect(screen.getByRole("button", { name: "Mobile-width preview" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Label", { exact: true })).toHaveValue("Continue");
    fireEvent.click(screen.getByRole("button", { name: "Full-width preview" }));
    expect(container.querySelector(".playground-sample")).not.toHaveClass("narrow");
  });
});
