import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "@/components/code-block";

describe("code clipboard", () => {
  it("copies the formatted code and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({ writeText } as unknown as Clipboard);
    const { container } = render(<CodeBlock code={'<Button>Save</Button>'} label="jsx" />);
    expect(screen.getByText("jsx")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("<Button>Save</Button>;\n"));
    expect(screen.getByText("Copied")).toBeInTheDocument();
    expect(screen.queryByText("Prettier")).not.toBeInTheDocument();
    await waitFor(() => expect(container.querySelectorAll(".syntax-token").length).toBeGreaterThan(0));
    expect(container.querySelector("pre code")?.textContent).toBe("<Button>Save</Button>;\n");
    expect((container.querySelector(".syntax-token") as HTMLElement).style.getPropertyValue("--syntax-light")).toMatch(/^#/);
  });

  it("announces clipboard failure without throwing", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({ writeText } as unknown as Clipboard);
    render(<CodeBlock code="example" label="shell" />);
    expect(screen.queryByText("Prettier")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() => expect(screen.getByText("Copy unavailable")).toBeInTheDocument());
  });
});
