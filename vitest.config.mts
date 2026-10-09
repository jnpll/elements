import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/unit/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    // Share React between the package primitives and the test renderer.
    server: { deps: { inline: [/elements-ui/] } },
    reporters: process.env.CI ? ["default", "junit", "json"] : ["default"],
    outputFile: {
      junit: "test-results/unit/junit.xml",
      json: "test-results/unit/results.json",
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/catalog.ts", "src/components/{controls,code-block,component-preview}.tsx"],
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "test-results/unit/coverage",
      reportOnFailure: true,
      thresholds: { lines: 85, functions: 85, branches: 80, statements: 85 },
    },
  },
});
