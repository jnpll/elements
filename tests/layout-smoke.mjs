import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
const baseURL = process.env.TEST_URL || "http://localhost:3010";
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  await page.goto(`${baseURL}/playground`);
  await page.getByRole("heading", { name: "Good morning, Eleanor" }).waitFor();
  await page.getByRole("button", { name: "Mobile layout preview", exact: true }).click();
  const mobilePreview = await page.locator(".sample-app").evaluate(el => ({
    width: el.getBoundingClientRect().width,
    columns: getComputedStyle(el.querySelector(".sample-body")).gridTemplateColumns.split(" ").length,
    navigation: getComputedStyle(el.querySelector(".sample-navigation")).flexDirection,
  }));
  assert.equal(mobilePreview.width, 360, "Mobile preview stays 360px wide on a desktop viewport");
  assert.equal(mobilePreview.columns, 1, "Container queries collapse the embedded layout");
  assert.equal(mobilePreview.navigation, "row");
  await page.getByRole("button", { name: "Desktop layout preview", exact: true }).click();
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page.getByRole("textbox", { name: "Project name" }).fill("Summer launch");
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await page.getByRole("textbox", { name: "Search sample projects" }).fill("Summer");
  assert.ok(await page.getByRole("cell", { name: "Summer launch", exact: true }).isVisible());
  await page.getByRole("textbox", { name: "Search sample projects" }).fill("");
  await page.getByRole("tab", { name: "Board", exact: true }).click();
  await page.getByRole("button", { name: "Advance Explore typography" }).click();
  assert.ok(await page.getByRole("region", { name: "In progress", exact: true }).getByText("Explore typography").isVisible());
  await page.getByRole("tab", { name: "Settings", exact: true }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("Freya Morgan");
  await page.getByRole("switch", { name: "Weekly digest" }).check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  assert.match(await page.getByRole("status").innerText(), /Changes saved/);
  for (const mode of ["light", "dark"]) {
    await page.evaluate(mode => { document.documentElement.classList.toggle("dark", mode === "dark"); localStorage.setItem("elements-docs-theme", mode); }, mode);
    for (const theme of ["alpha", "britanniae"]) {
      await page.getByRole("combobox", { name: "Layout theme" }).selectOption(theme);
      const palettes = theme === "alpha" ? ["neutral"] : ["arthur", "guinevere", "merlin", "mordred", "percival", "lancelot", "galahad"];
      for (const palette of palettes) {
        await page.getByRole("combobox", { name: "Layout palette" }).selectOption(palette);
        await page.getByRole("tab", { name: "Overview", exact: true }).click();
        await page.screenshot({ path: `test-results/layout-${theme}-${palette}-${mode}.png`, fullPage: true });
      }
    }
    for (const preset of ["Overview", "Board", "Settings"]) {
      await page.getByRole("tab", { name: preset, exact: true }).click();
      assert.equal(await page.getByRole("tab", { name: preset, exact: true }).getAttribute("aria-selected"), "true");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: `test-results/layout-${preset.toLowerCase()}-${mode}.png`, fullPage: true });
    }
  }
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole("button", { name: "Mobile layout preview", exact: true }).click();
    assert.equal(await page.locator("#main").evaluate(el => getComputedStyle(el).paddingLeft), width === 320 ? "16px" : "20px", "Responsive page padding overrides desktop layout sizing");
    const headerBounds = await page.locator(".header-tools").boundingBox();
    assert.ok(headerBounds.x + headerBounds.width <= width + 1, "Mobile header controls stay on screen");
    for (const preset of ["Overview", "Board", "Settings"]) {
      await page.getByRole("tab", { name: preset, exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: `test-results/layout-${preset.toLowerCase()}-${width}.png`, fullPage: true });
    }
  }
  await page.reload();
  await page.getByRole("heading", { name: "Account settings" }).waitFor();
  assert.deepEqual(errors, []);
  console.log("Passed layout interactions, theme/palette selection, all presets in light/dark mode, URL persistence, and desktop/mobile layouts.");
} finally { await browser.close(); }
