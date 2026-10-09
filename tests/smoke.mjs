import assert from "node:assert/strict";
import { mkdir, readdir } from "node:fs/promises";
import { chromium } from "playwright";
import { toggleAppearance } from "./appearance-helpers.mjs";

const baseURL = process.env.TEST_URL || "http://localhost:3010";
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", error => errors.push(error.message));
// ThemeSelector is an app-level control, exercised by the header checks.
const allIds = (await readdir("node_modules/@jnpll/elements-ui/dist/components")).filter(name => name.endsWith(".js") && name !== "theme-selector.js").map(name => name.slice(0, -3));
await mkdir("test-results", { recursive: true });
async function noOverflow() { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal page overflow"); }
async function openComponent(id) {
  assert.equal((await page.goto(baseURL + "/components/" + id)).status(), 200);
  await page.locator(".preview-stage").waitFor();
  await page.getByRole("button", { name: "Toggle properties", exact: true }).click();
  await page.getByRole("complementary", { name: "Component properties" }).waitFor();
}
async function generatedCode() {
  await page.locator(".component-preview").getByRole("tab", { name: "Code", exact: true }).click();
  const code = await page.locator(".component-preview .code-block code").innerText();
  await page.locator(".component-preview").getByRole("tab", { name: "Preview", exact: true }).click();
  return code;
}
try {
  for (const id of allIds) {
    await openComponent(id);
    assert.ok(await page.locator(".preview-stage *").count());
    assert.ok(await page.getByRole("complementary", { name: "Component properties" }).isVisible());
    await noOverflow();
  }
  await openComponent("button");
  assert.equal(await page.locator(".component-preview-stage").evaluate(el => getComputedStyle(el).padding), "28px 16px", "Preview utilities keep the intended padding");
  await page.getByLabel("Label", { exact: true }).fill("Publish");
  await page.getByLabel("Variant", { exact: true }).selectOption("outline");
  await page.getByLabel("Size", { exact: true }).selectOption("xs");
  const button = page.locator(".preview-sample").getByRole("button", { name: "Publish", exact: true });
  await button.click();
  assert.match(await page.locator(".preview-feedback").innerText(), /Activated 1 time/);
  assert.equal(await button.evaluate(el => Math.round(el.getBoundingClientRect().height)), 24);
  await page.getByRole("switch", { name: "Disabled", exact: true }).check();
  assert.ok(await button.isDisabled());
  assert.match(await generatedCode(), /variant="outline" size="xs" disabled/);
  await page.locator(".component-preview").getByRole("tab", { name: "Code", exact: true }).click();
  await page.locator(".component-preview").getByRole("button", { name: "Copy code", exact: true }).click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Publish/);
  await page.locator(".component-preview").getByRole("tab", { name: "Preview", exact: true }).click();
  await page.getByRole("button", { name: "Toggle properties", exact: true }).click();
  assert.equal(await page.getByLabel("Label", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "Toggle properties", exact: true }).click();
  assert.equal(await page.getByLabel("Label", { exact: true }).inputValue(), "Publish");
  await page.getByRole("button", { name: "Reset properties", exact: true }).click();
  assert.equal(await page.getByLabel("Label", { exact: true }).inputValue(), "Continue");
  await page.screenshot({ path: "test-results/desktop-component-properties.png", fullPage: true });

  await openComponent("tabs");
  await page.getByLabel("Orientation", { exact: true }).selectOption("vertical");
  await page.getByLabel("List variant", { exact: true }).selectOption("line");
  await page.locator(".preview-sample").getByRole("tab", { name: "Activity" }).click();
  assert.match(await generatedCode(), /orientation="vertical"/);
  await openComponent("tooltip");
  await page.locator(".preview-sample .sample-trigger").hover();
  await page.locator('[data-slot="tooltip-content"][data-open]').filter({ hasText: "Save to collection" }).waitFor();
  await page.mouse.move(0, 0);
  await openComponent("scroll-area");
  const viewport = page.locator('.preview-sample [data-slot="scroll-area-viewport"]');
  await viewport.evaluate(el => { el.scrollTop = 200; });
  assert.ok(await viewport.evaluate(el => el.scrollTop > 0));
  await openComponent("dialog");
  await page.locator(".preview-sample").getByRole("button", { name: "Open Dialog" }).click();
  await page.getByRole("dialog", { name: "Edit profile" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await openComponent("select");
  await page.locator(".preview-sample").getByRole("combobox").click();
  await page.getByRole("option", { name: "Banana", exact: true }).click();
  await page.getByLabel("Example", { exact: true }).selectOption("1");
  assert.ok(await page.locator(".preview-sample").getByRole("combobox").isDisabled());
  assert.match(await generatedCode(), /disabled/);
  await openComponent("chart");
  await page.locator(".preview-sample .recharts-bar-rectangle").first().waitFor();
  await page.screenshot({ path: "test-results/chart-component-properties.png", fullPage: true });
  await page.goto(baseURL + "/playground?component=button");
  assert.match(page.url(), /components\/button$/);
  await page.goto(baseURL + "/layouts?layout=board");
  await page.getByRole("heading", { name: "Project board", exact: true }).waitFor();
  assert.match(page.url(), /playground\?layout=board$/);
  await toggleAppearance(page);
  await page.reload();
  assert.ok(await page.locator("html").evaluate(el => el.classList.contains("dark")));

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ["button", "calendar", "chart", "table", "sidebar", "field", "navigation-menu", "carousel"]) {
      await openComponent(id);
      await noOverflow();
    }
    await openComponent("button");
    await page.getByRole("button", { name: "Mobile-width preview", exact: true }).click();
    await page.screenshot({ path: "test-results/mobile-component-properties-" + width + ".png", fullPage: true });
  }
  assert.equal((await page.goto(baseURL + "/components/not-a-component")).status(), 404);
  assert.deepEqual(errors, []);
  console.log("Passed all component previews, toggleable properties, generated code, clipboard, interactions, redirects, and mobile layout.");
} finally { await browser.close(); }
