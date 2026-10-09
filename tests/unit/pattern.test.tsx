import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Pattern } from "@jnpll/elements-ui/pattern";
import { Controls } from "@/components/controls";
import { defaultOptions, sampleCode } from "@/lib/catalog";

it("renders a decorative pattern without hiding or disabling its children", () => {
  const click = vi.fn();
  const { container } = render(<Pattern id="canvas" fade color="var(--primary)" background="var(--card)"><button onClick={click}>Create</button></Pattern>);
  const surface = container.querySelector('[data-slot="pattern"]') as HTMLElement;
  const pattern = container.querySelector('[data-slot="pattern-pattern"]') as HTMLElement;
  expect(surface.id).toBe("canvas");
  expect(surface.style.getPropertyValue("--pattern-color")).toBe("var(--primary)");
  expect(pattern).toHaveAttribute("aria-hidden", "true");
  expect(pattern.style.backgroundImage).toContain("radial-gradient");
  expect(pattern.style.maskImage).toContain("radial-gradient");
  expect(surface.style.maskImage).toBe("");
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  expect(click).toHaveBeenCalledOnce();
});

it("supports grids, no pattern, style overrides, and safe numeric limits", () => {
  const { container, rerender } = render(<Pattern pattern="grid" spacing={24} size={1} style={{ padding: 20 }} />);
  const layer = () => container.querySelector('[data-slot="pattern-pattern"]') as HTMLElement;
  expect(layer().style.backgroundImage).toContain("linear-gradient");
  expect(layer().style.backgroundSize).toBe("24px 24px");
  expect((container.firstChild as HTMLElement).style.padding).toBe("20px");
  rerender(<Pattern pattern="none" />);
  expect(layer().style.backgroundImage).toBe("none");
  rerender(<Pattern spacing={-1} size={99} />);
  expect(layer().style.backgroundSize).toBe("2px 2px");
  expect(layer().style.backgroundImage).toContain("1px");
  rerender(<Pattern spacing={NaN} size={Infinity} />);
  expect(layer().style.backgroundSize).toBe("12px 12px");
});

it("updates preview controls and generates the corresponding package recipe", () => {
  const onChange = vi.fn();
  const options = defaultOptions("pattern");
  render(<Controls id="pattern" options={options} onChange={onChange} />);
  fireEvent.change(screen.getByLabelText("Pattern", { exact: true }), { target: { value: "grid" } });
  fireEvent.change(screen.getByRole("slider", { name: "Spacing" }), { target: { value: "24" } });
  fireEvent.change(screen.getByRole("slider", { name: "Pattern size" }), { target: { value: "1.2" } });
  fireEvent.click(screen.getByRole("switch", { name: "Fade edges" }));
  expect(onChange.mock.calls.map(([patch]) => patch)).toEqual([{ pattern: "grid" }, { spacing: 24 }, { patternSize: 1.2 }, { fade: true }]);
  const code = sampleCode("pattern", { ...options, pattern: "grid", spacing: 24, patternSize: 1.2, fade: true });
  expect(code).toContain('import { Pattern } from "@jnpll/elements-ui/pattern"');
  expect(code).toContain('pattern="grid" spacing={24} size={1.2} fade');
});
