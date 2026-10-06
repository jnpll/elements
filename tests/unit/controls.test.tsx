import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Controls } from "@/components/controls";
import { componentIds, defaultOptions } from "@/lib/catalog";

describe("property controls", () => {
  it.each(componentIds)("renders controls for %s", (id) => {
    const { container } = render(<Controls id={id} options={defaultOptions(id)} onChange={vi.fn()} />);
    expect(container.querySelector("input,select")).not.toBeNull();
  });

  it("emits isolated label, variant, size, disabled, and icon patches", () => {
    const onChange = vi.fn();
    render(<Controls id="button" options={defaultOptions("button")} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Label", { exact: true }), { target: { value: "Publish" } });
    fireEvent.change(screen.getByLabelText("Variant"), { target: { value: "outline" } });
    fireEvent.change(screen.getByLabelText("Size"), { target: { value: "xs" } });
    fireEvent.click(screen.getByRole("switch", { name: "Disabled" }));
    fireEvent.click(screen.getByRole("switch", { name: "Leading icon" }));
    expect(onChange.mock.calls.map(([patch]) => patch)).toEqual([
      { text: "Publish" }, { variant: "outline" }, { size: "xs" }, { disabled: true }, { icon: true },
    ]);
  });

  it("emits numeric delays instead of input strings", () => {
    const onChange = vi.fn();
    render(<Controls id="tooltip" options={defaultOptions("tooltip")} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "400" } });
    expect(onChange).toHaveBeenCalledWith({ delay: 400 });
  });

  it("uses example controls rather than unrelated label controls for expanded components", () => {
    const onChange = vi.fn();
    render(<Controls id="select" options={defaultOptions("select")} onChange={onChange} />);
    expect(screen.queryByLabelText("Label", { exact: true })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Example"), { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith({ example: 1 });
  });
});
