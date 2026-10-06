import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  get: () => ({ writeText: vi.fn().mockResolvedValue(undefined) }),
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
