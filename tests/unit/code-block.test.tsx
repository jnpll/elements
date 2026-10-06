import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "@/components/code-block";

describe("code clipboard", () => {
  beforeEach(() => vi.useFakeTimers());

  it("copies the exact code, announces success, and resets feedback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({ writeText } as unknown as Clipboard);
    render(<CodeBlock code={'<Button>Save</Button>'} label="jsx" />);
    expect(screen.getByText("jsx")).toBeInTheDocument();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy code" })));
    expect(writeText).toHaveBeenCalledWith("<Button>Save</Button>");
    expect(screen.getByText("Copied")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });

  it("announces clipboard failure without throwing", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({ writeText } as unknown as Clipboard);
    render(<CodeBlock code="example" />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy code" })));
    expect(screen.getByText("Copy unavailable")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.queryByText("Copy unavailable")).not.toBeInTheDocument();
  });
});
