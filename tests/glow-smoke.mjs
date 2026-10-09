import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await mkdir("test-results", { recursive: true });
try {
  await page.goto(`${process.env.TEST_URL || "http://localhost:3010"}/components/glass-panel`);
  await page.getByRole("button", { name: "Toggle properties" }).click();
  await page.getByRole("switch", { name: "Gradient ring" }).check();
  await page.locator(".preview-stage .glass-ring").waitFor();
  const results = await page.evaluate(() => {
    const root = document.documentElement;
    const panel = document.querySelector(".preview-stage .glass-ring");
    const probe = document.createElement("span");
    probe.className = "text-gradient";
    probe.textContent = "Palette gradient";
    panel.append(probe);
    const results = [];
    for (const palette of ["neutral", "arthur", "guinevere", "merlin", "mordred", "percival", "lancelot", "galahad"]) {
      root.dataset.elementsTheme = palette === "neutral" ? "alpha" : "britanniae";
      root.dataset.elementsPalette = palette;
      for (const dark of [false, true]) {
        root.classList.toggle("dark", dark);
        const colors = ["primary", "secondary"].map(token => {
          probe.style.backgroundColor = `var(--${token})`;
          return getComputedStyle(probe).backgroundColor;
        });
        results.push({ palette, dark, colors, ring: getComputedStyle(panel, "::after").backgroundImage, text: getComputedStyle(probe).backgroundImage });
      }
    }
    // A consumer override must update both effects without extra glow variables.
    root.style.setProperty("--primary", "rgb(120 30 55)");
    root.style.setProperty("--secondary", "rgb(50 90 70)");
    results.push({ palette: "custom", colors: ["rgb(120, 30, 55)", "rgb(50, 90, 70)"], ring: getComputedStyle(panel, "::after").backgroundImage, text: getComputedStyle(probe).backgroundImage });
    return results;
  });
  for (const result of results) {
    for (const color of result.colors) {
      assert.ok(result.ring.includes(color), `${result.palette}: ring must use ${color}`);
      assert.ok(result.text.includes(color), `${result.palette}: text must use ${color}`);
    }
  }
  await page.screenshot({ path: "test-results/semantic-glow-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: "test-results/semantic-glow-mobile.png", fullPage: true });
  console.log("Verified primary/secondary glow colours for eight palettes, both modes, and custom overrides.");
} finally {
  await browser.close();
}
