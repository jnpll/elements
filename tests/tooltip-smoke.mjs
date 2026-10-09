import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  const base = process.env.TEST_URL || "http://localhost:3010";
  await page.goto(`${base}/components/button`);
  for (const name of ["GitHub repository", "Select theme and palette", "Full-width preview", "Mobile-width preview", "Toggle properties", "Reset properties", "View component source on GitHub"]) {
    const trigger = page.getByRole(name.includes("GitHub") ? "link" : "button", { name, exact: true }).first();
    await trigger.hover();
    await page.getByRole("tooltip").waitFor();
    const text = await page.getByRole("tooltip").innerText();
    assert.match(text, name === "Select theme and palette" ? /Theme and palette: Alpha \/ Neutral/ : new RegExp(name));
    await page.mouse.move(0, 900);
    await page.getByRole("tooltip").waitFor({ state: "hidden" });
  }
  const copy = page.getByRole("button", { name: "Copy code", exact: true }).first();
  assert.equal(await copy.getAttribute("title"), "Copy code");
  assert.equal(await copy.getAttribute("data-base-ui-tooltip-trigger"), null);
  const selector = page.getByRole("button", { name: "Select theme and palette", exact: true });
  await selector.click();
  await page.getByRole("menuitemradio", { name: "Merlin", exact: true }).click();
  await page.getByRole("menu").waitFor({ state: "hidden" });
  await page.mouse.move(0, 900);
  await selector.hover();
  await page.getByRole("tooltip").waitFor();
  assert.match(await page.getByRole("tooltip").innerText(), /Britanniae \/ Merlin/);
  await page.screenshot({ path: "test-results/custom-action-tooltip.png" });
  await page.goto(`${base}/components/collapsible`);
  const details = page.locator(".preview-stage").getByRole("button", { name: "Toggle details", exact: true });
  await details.hover();
  await page.getByRole("tooltip").waitFor();
  await details.click();
  assert.ok(await page.locator(".preview-stage").getByText("Shipping address", { exact: true }).isVisible());
  await page.goto(`${base}/playground`);
  await page.getByRole("button", { name: "Desktop layout preview" }).hover();
  await page.getByRole("tooltip").waitFor();
  assert.equal(await page.getByRole("tooltip").innerText(), "Desktop layout preview");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.mouse.move(0, 900);
  await page.getByRole("tooltip").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Open navigation", exact: true }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await page.getByRole("tooltip").waitFor();
  assert.equal(await page.getByRole("tooltip").innerText(), "Open navigation");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.deepEqual(errors, []);
  console.log("Verified custom-action tooltips, keyboard focus, menu/collapsible composition, and native Copy label.");
} finally {
  await browser.close();
}
