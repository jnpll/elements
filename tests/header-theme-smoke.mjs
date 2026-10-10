import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { toggleAppearance } from "./appearance-helpers.mjs";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  await page.goto(process.env.TEST_URL || "http://localhost:3010");
  const trigger = page.getByRole("button", { name: "Select theme and palette", exact: true });
  await trigger.click();
  const picker = page.locator("[data-theme-picker]");
  await picker.getByRole("button", { name: "Base", exact: true }).waitFor();
  assert.equal(await picker.getByRole("button").count(), 5);
  assert.match(await picker.getByRole("button", { name: "Base", exact: true }).innerText(), /01/);
  await page.screenshot({ path: "test-results/theme-selector-desktop.png" });
  await picker.getByRole("button", { name: "Britanniae", exact: true }).click();
  await picker.getByRole("button", { name: "Merlin", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("data-elements-palette"), "merlin");
  await page.reload();
  await trigger.click();
  assert.equal(await picker.getByRole("button", { name: "Merlin" }).getAttribute("aria-pressed"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await trigger.getAttribute("aria-expanded"), "false");
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Select theme and palette");
  await toggleAppearance(page);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.reload();
    await trigger.click();
    await picker.waitFor();
    const bounds = await picker.boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width);
    const buttons = await page.locator(".site-header button").evaluateAll(els => els.map(el => {
      const { left, right } = el.getBoundingClientRect();
      return { left, right };
    }));
    assert.ok(buttons.every(button => button.left >= 0 && button.right <= width));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `test-results/theme-selector-mobile-${width}.png` });
    if (width === 320) await picker.getByRole("button", { name: "Alpha", exact: true }).click();
    await picker.getByRole("button", { name: width === 390 ? "Arthur" : "Base", exact: true }).click();
    await picker.waitFor({ state: "hidden" });
    assert.ok(await page.locator("html").evaluate(el => el.classList.contains("dark")));
  }
  assert.equal(await page.locator("html").getAttribute("data-elements-theme"), "alpha");
  assert.deepEqual(errors, []);
  console.log("Passed header theme selection, persistence, keyboard dismissal, and mobile menu bounds.");
} finally {
  await browser.close();
}
