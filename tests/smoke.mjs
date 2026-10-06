import assert from "node:assert/strict";
import { mkdir, readdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.env.TEST_URL || "http://localhost:3010";
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") console.log("Browser console:", message.text()); });
const ids = ["button", "badge", "card", "glass-panel", "tabs", "tooltip", "separator", "scroll-area"];
const allIds = (await readdir("node_modules/@jnpll/elements-ui/dist/components")).filter((name) => name.endsWith(".js")).map((name) => name.slice(0, -3));
await mkdir("test-results", { recursive: true });

async function noOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Page should not overflow horizontally");
}

try {
  for (const id of allIds) {
    const response = await page.goto(`${baseURL}/components/${id}`);
    assert.equal(response.status(), 200, `${id} documentation should load`);
    await page.locator(".preview-stage").waitFor();
    assert.ok(await page.locator(".preview-stage").locator("*").count(), `${id} preview should render`);
    await noOverflow();
  }
  await page.goto(`${baseURL}/components/button`);
  await page.locator(".preview-stage").getByRole("button", { name: "Continue", exact: true }).click();
  assert.match(await page.locator(".preview-feedback").innerText(), /Activated 1 time/);
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  assert.match(await page.locator(".example-tabs code").innerText(), /@jnpll\/elements-ui\/button/);
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await page.screenshot({ path: "test-results/desktop-docs.png", fullPage: true });
  await page.getByLabel("Find a component").fill("glass");
  assert.equal(await page.locator('.sidebar a[href^="/components/"]').count(), 1);
  await page.getByLabel("Find a component").fill("");

  await page.goto(`${baseURL}/playground?component=button`);
  await page.getByLabel("Label", { exact: true }).fill("Publish");
  await page.getByLabel("Variant", { exact: true }).selectOption("outline");
  await page.getByLabel("Size", { exact: true }).selectOption("xs");
  const button = page.locator(".playground-sample").getByRole("button", { name: "Publish", exact: true });
  await page.waitForFunction(() => Math.round(document.querySelector('.playground-sample button')?.getBoundingClientRect().height ?? 0) === 24);
  assert.equal(await button.evaluate((el) => Math.round(el.getBoundingClientRect().height)), 24, "The preview should preserve the library's xs height");
  await page.getByRole("switch", { name: "Disabled", exact: true }).check();
  assert.ok(await button.isDisabled());
  assert.match(await page.locator(".code-block code").innerText(), /variant="outline" size="xs" disabled/);
  await page.getByRole("button", { name: "Copy code", exact: true }).click();
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /Publish/);
  await page.getByRole("button", { name: "Reset properties", exact: true }).click();
  assert.equal(await page.getByLabel("Label", { exact: true }).inputValue(), "Continue");

  await page.getByLabel("Component", { exact: true }).selectOption("tabs");
  await page.getByLabel("Orientation", { exact: true }).selectOption("vertical");
  await page.getByLabel("List variant", { exact: true }).selectOption("line");
  await page.locator(".playground-sample").getByRole("tab", { name: "Activity" }).click();
  assert.match(await page.locator(".playground-sample").getByRole("tabpanel", { name: "Activity" }).innerText(), /up to date/);
  assert.match(await page.locator(".code-block code").innerText(), /orientation="vertical"/);

  await page.getByLabel("Component", { exact: true }).selectOption("tooltip");
  await page.locator(".sample-trigger").hover();
  await page.locator('[data-slot="tooltip-content"]').waitFor();
  assert.match(await page.locator('[data-slot="tooltip-content"]').innerText(), /Save to collection/);
  await page.mouse.move(0, 0);
  await page.getByLabel("Component", { exact: true }).selectOption("scroll-area");
  const viewport = page.locator('.playground-sample [data-slot="scroll-area-viewport"]');
  await viewport.evaluate((el) => { el.scrollTop = 200; });
  assert.ok(await viewport.evaluate((el) => el.scrollTop > 0));

  for (const id of ids) {
    await page.getByLabel("Component", { exact: true }).selectOption(id);
    assert.match(await page.locator(".code-block code").innerText(), new RegExp(`elements-ui/${id}`));
    await noOverflow();
  }
  await page.getByLabel("Component", { exact: true }).selectOption("glass-panel");
  await page.getByRole("switch", { name: "Strong surface", exact: true }).check();
  await page.getByRole("switch", { name: "Gradient ring", exact: true }).check();
  assert.equal(await page.locator(".playground-sample .glass-strong.glass-ring").count(), 1);
  await page.screenshot({ path: "test-results/desktop-playground.png", fullPage: true });
  await page.getByLabel("Component", { exact: true }).selectOption("dialog");
  await page.locator(".playground-sample").getByRole("button", { name: "Open Dialog" }).click();
  await page.getByRole("dialog", { name: "Edit profile" }).waitFor();
  await page.getByRole("dialog").getByLabel("Name", { exact: true }).fill("Elements user");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByLabel("Component", { exact: true }).selectOption("select");
  await page.locator(".playground-sample").getByRole("combobox").click();
  await page.getByRole("option", { name: "Banana", exact: true }).click();
  assert.match(await page.locator(".playground-sample").innerText(), /Banana/);
  await page.getByLabel("Example", { exact: true }).selectOption("1");
  assert.ok(await page.locator(".playground-sample").getByRole("combobox").isDisabled());
  assert.match(await page.locator(".code-block code").innerText(), /disabled/);
  await page.getByLabel("Component", { exact: true }).selectOption("switch");
  const preference = page.locator(".playground-sample").getByRole("switch");
  await preference.check();
  assert.ok(await preference.isChecked());
  await page.getByLabel("Component", { exact: true }).selectOption("input-otp");
  const otp = page.locator(".playground-sample [data-input-otp]");
  assert.equal(await otp.inputValue(), "123456");
  await otp.press("ControlOrMeta+a");
  await otp.pressSequentially("654321");
  await page.waitForFunction(() => document.querySelector('.playground-sample [data-input-otp]')?.value === "654321");
  assert.equal(await otp.inputValue(), "654321");
  await page.getByLabel("Component", { exact: true }).selectOption("chart");
  await page.locator(".playground-sample .recharts-bar-rectangle").first().waitFor();
  assert.ok(await page.locator(".playground-sample .recharts-bar-rectangle").count() > 0);
  await page.screenshot({ path: "test-results/chart-playground.png", fullPage: true });
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  assert.ok(await page.locator("html").evaluate((el) => el.classList.contains("dark")));
  await page.reload();
  assert.ok(await page.locator("html").evaluate((el) => el.classList.contains("dark")));
  await page.screenshot({ path: "test-results/dark-playground.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/components/button`);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  assert.ok(await page.getByRole("button", { name: "Open navigation" }).isVisible());
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator('.sidebar a[href="/components/card"]').click();
  await page.getByRole("heading", { name: "Card", exact: true }).waitFor();
  assert.ok(await page.getByRole("button", { name: "Open navigation" }).isVisible());
  assert.ok(await page.locator(".preview-stage img").evaluate((el) => el.complete && el.naturalWidth > 0));
  await noOverflow();
  await page.screenshot({ path: "test-results/mobile-docs.png", fullPage: true });
  await page.goto(`${baseURL}/playground?component=button`);
  await page.getByLabel("Label", { exact: true }).fill("Mobile action");
  await page.getByRole("button", { name: "Mobile-width preview" }).click();
  await noOverflow();
  await page.screenshot({ path: "test-results/mobile-playground.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  await noOverflow();
  for (const id of ["calendar", "chart", "table", "sidebar", "field", "navigation-menu", "carousel"]) {
    await page.goto(`${baseURL}/components/${id}`);
    await page.locator(".preview-stage").waitFor();
    await noOverflow();
  }

  for (const route of ["getting-started", "tokens"]) assert.equal((await page.goto(`${baseURL}/${route}`)).status(), 200);
  assert.equal((await page.goto(`${baseURL}/components/not-a-component`)).status(), 404);
  assert.deepEqual(errors, [], "No uncaught browser errors");
  console.log("Passed: all component pages and playgrounds, prop controls, clipboard, tabs, tooltip, scrolling, theme persistence, mobile navigation, image loading, layout, and 404.");
} catch (error) {
  console.log("Browser errors:", errors);
  await page.screenshot({ path: "test-results/failure.png", fullPage: true });
  throw error;
} finally {
  await browser.close();
}
