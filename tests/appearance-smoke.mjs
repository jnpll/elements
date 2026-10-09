import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { setAppearance } from "./appearance-helpers.mjs";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const isDark = () => page.locator("html").evaluate(el => el.classList.contains("dark"));
async function expectDark(value) {
  await page.waitForFunction(expected => document.documentElement.classList.contains("dark") === expected, value);
}
try {
  await page.goto(process.env.TEST_URL || "http://localhost:3010");
  const trigger = page.getByRole("button", { name: "Select appearance", exact: true });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(await page.getByRole("menuitemradio", { name: "System", exact: true }).getAttribute("aria-checked"), "true");
  assert.equal(await page.getByRole("menuitemradio").count(), 3);
  await page.keyboard.press("Escape");
  await expectDark(false);
  await page.emulateMedia({ colorScheme: "dark" });
  await expectDark(true);
  await setAppearance(page, "Light");
  await expectDark(false);
  await page.reload();
  assert.equal(await isDark(), false);
  await setAppearance(page, "Dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expectDark(true);
  await setAppearance(page, "System");
  await expectDark(false);
  assert.equal(await page.evaluate(() => localStorage.getItem("elements-docs-theme")), "system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expectDark(true);
  await page.reload();
  await expectDark(true);
  await setAppearance(page, "System");
  await page.setViewportSize({ width: 320, height: 844 });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu");
  await menu.waitFor();
  const bounds = await menu.boundingBox();
  assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 320);
  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/appearance-mobile.png" });
  assert.deepEqual(errors, []);
  console.log("Verified System default, live OS updates, explicit overrides, persistence, and mobile appearance menu.");
} finally { await browser.close(); }
