import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { IconTooltip } from "@/components/icon-tooltip";

it("shows a custom action label on hover without adding a button wrapper", async () => {
  const user = userEvent.setup();
  const click = vi.fn();
  render(<IconTooltip label="Reset preview"><button onClick={click}><svg aria-hidden="true" /></button></IconTooltip>);
  const button = screen.getByRole("button", { name: "Reset preview" });
  expect(button.querySelector("svg")).not.toBeNull();
  expect(screen.getAllByRole("button")).toHaveLength(1);
  await user.hover(button);
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Reset preview");
  await user.click(button);
  expect(click).toHaveBeenCalledOnce();
});

it("works on keyboard focus and preserves the trigger's existing accessible name", async () => {
  const user = userEvent.setup();
  render(<IconTooltip label="View component source on GitHub"><a href="https://github.com/jnpll/elements-ui" aria-label="Source">Source</a></IconTooltip>);
  await user.tab();
  expect(screen.getByRole("link", { name: "Source" })).toHaveFocus();
  expect(await screen.findByRole("tooltip")).toHaveTextContent("View component source on GitHub");
});

it("provides a focusable tooltip for disabled icon controls", async () => {
  const user = userEvent.setup();
  render(<IconTooltip label="Bold unavailable" disabled><button disabled aria-label="Bold" /></IconTooltip>);
  await user.tab();
  expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Bold unavailable");
});
