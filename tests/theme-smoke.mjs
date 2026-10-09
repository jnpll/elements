import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { toggleAppearance } from "./appearance-helpers.mjs";
import { alphaIcon, crown2BoldIcon } from "@jnpll/elements-ui/icons";

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
const baseURL = process.env.TEST_URL || "http://localhost:3010";
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  await page.goto(baseURL);
  const legend = page.getByLabel("Theme families", { exact: true });
  assert.equal(await legend.getByRole("link", { name: "Alpha", exact: true }).getAttribute("href"), "/themes/alpha");
  assert.equal(await legend.getByRole("link", { name: "Britanniae", exact: true }).getAttribute("href"), "/themes/britanniae");
  assert.ok(await legend.getByText("Alkali metals", { exact: true }).isVisible());
  const tileColors = await page.locator(".element-theme").evaluateAll(tiles => tiles.map(el => getComputedStyle(el).color));
  assert.notEqual(tileColors[0], "rgb(0, 0, 0)");
  assert.notEqual(tileColors[0], tileColors[1], "Light-mode text follows each tile family color");
  await page.getByRole("img", { name: "Alpha app icon", exact: true }).waitFor();
  assert.ok((await page.locator(".brand-icon").evaluate(el => getComputedStyle(el).maskImage)).includes(alphaIcon));
  await page.screenshot({ path: "test-results/alpha-home.png", fullPage: true });
  assert.equal((await page.request.get(`${baseURL}/theme-icons/alpha.svg`)).status(), 404, "No copied icon is needed");
  const colors = new Set();
  for (const name of ["Arthur", "Guinevere", "Merlin", "Mordred", "Percival", "Lancelot", "Galahad"]) {
    const tile = page.getByRole("button", { name: `Apply Britanniae ${name}`, exact: true });
    await tile.click();
    await page.getByRole("button", { name: `Apply Britanniae ${name}`, exact: true, pressed: true }).waitFor();
    await page.getByRole("img", { name: "Britanniae app icon", exact: true }).waitFor();
    assert.ok((await page.locator(".brand-icon").evaluate(el => getComputedStyle(el).maskImage)).includes(crown2BoldIcon));
    assert.equal(await tile.getAttribute("aria-pressed"), "true");
    const design = await page.locator("html").evaluate(el => ({
      theme: el.dataset.elementsTheme, palette: el.dataset.elementsPalette,
      primary: getComputedStyle(el).getPropertyValue("--primary").trim(),
      font: getComputedStyle(document.querySelector("h1")).fontFamily,
    }));
    assert.equal(design.theme, "britanniae");
    assert.equal(design.palette, name.toLowerCase());
    assert.match(design.font, /Georgia/);
    colors.add(design.primary);
    if (name === "Merlin") {
      assert.equal(design.primary, "#e4c65b");
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--background").trim()), "#f4effa");
    }
    if (name === "Mordred") {
      assert.equal(design.primary, "#702638");
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--background").trim()), "#fafafa");
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).colorScheme), "light");
      await toggleAppearance(page);
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--background").trim()), "#101010");
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--primary").trim()), "#a34860");
      assert.match(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--primary-foreground").trim()), /^#(?:fff|ffffff)$/);
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).colorScheme), "dark");
      await toggleAppearance(page);
    }
    await page.screenshot({ path: `test-results/britanniae-${name.toLowerCase()}.png`, fullPage: true });
  }
  assert.equal(colors.size, 7);
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-elements-palette"), "galahad");
  await toggleAppearance(page);
  assert.equal(await page.locator(".element-theme").first().evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
  for (const name of ["Arthur", "Percival", "Lancelot", "Galahad"]) {
    await page.getByRole("button", { name: `Apply Britanniae ${name}`, exact: true }).click();
    await page.getByRole("button", { name: `Apply Britanniae ${name}`, exact: true, pressed: true }).waitFor();
    const tokens = await page.locator("html").evaluate(el => {
      const style = getComputedStyle(el);
      return { primary: style.getPropertyValue("--primary").trim(), ring: style.getPropertyValue("--ring").trim() };
    });
    assert.deepEqual(tokens, { primary: "#e1be67", ring: "#e1be67" });
  }
  await page.getByRole("button", { name: "Apply Britanniae Merlin", exact: true }).click();
  assert.ok(await page.locator("html").evaluate(el => el.classList.contains("dark")));
  await page.goto(`${baseURL}/components/button`);
  assert.equal(await page.locator("html").getAttribute("data-elements-palette"), "merlin");
  const button = page.locator(".preview-stage").getByRole("button", { name: "Continue", exact: true });
  assert.equal(await button.evaluate(el => getComputedStyle(el).borderRadius), "3px");
  await page.screenshot({ path: "test-results/britanniae-merlin-docs-dark.png", fullPage: true });
  await page.goto(`${baseURL}/playground`);
  assert.equal(await page.locator("html").getAttribute("data-elements-theme"), "britanniae");
  await page.goto(`${baseURL}/themes/britanniae`);
  await page.getByRole("heading", { name: "Britanniae", exact: true }).waitFor();
  await page.getByRole("button", { name: "Arthur", exact: true }).click();
  const colorsSection = page.getByRole("region", { name: "Palette colors", exact: true });
  const appearance = await page.locator("html").getAttribute("class");
  await colorsSection.getByRole("tab", { name: "Light", exact: true }).click();
  assert.equal(await colorsSection.getByLabel("Arthur light color tokens").locator('[data-color-token="--primary"]').evaluate(el => getComputedStyle(el).backgroundColor), "rgb(165, 43, 55)");
  assert.equal(await colorsSection.getByLabel("Arthur light color tokens").locator('[data-color-token="--card-foreground"]').evaluate(el => getComputedStyle(el).backgroundColor), "rgb(32, 35, 42)");
  await colorsSection.getByRole("tab", { name: "Dark", exact: true }).click();
  assert.equal(await colorsSection.getByLabel("Arthur dark color tokens").locator('[data-color-token="--primary"]').evaluate(el => getComputedStyle(el).backgroundColor), "rgb(225, 190, 103)");
  assert.equal(await page.locator("html").getAttribute("class"), appearance, "Swatch mode does not change the app mode");
  await colorsSection.getByText("Arthur CSS", { exact: true }).click();
  assert.match(await colorsSection.locator("pre").innerText(), /--primary: #a52b37/);
  await page.getByRole("button", { name: "Merlin", exact: true }).click();
  assert.equal(await colorsSection.getByRole("tab", { name: "Dark", exact: true }).getAttribute("aria-selected"), "true");
  assert.ok(await colorsSection.getByLabel("Merlin dark color tokens").isVisible());
  await page.screenshot({ path: "test-results/palette-colors-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.waitForFunction(() => document.querySelector(".sidebar").getBoundingClientRect().right <= 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: "test-results/palette-colors-mobile.png", fullPage: true });
  await page.goto(baseURL);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const tile = page.getByRole("button", { name: "Apply Britanniae Lancelot", exact: true });
    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `test-results/britanniae-mobile-${width}.png`, fullPage: true });
  }
  await page.getByRole("button", { name: "Apply Alpha Neutral", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("data-elements-theme"), "alpha");
  assert.doesNotMatch(await page.locator("h1").evaluate(el => getComputedStyle(el).fontFamily), /Georgia/);
  assert.deepEqual(errors, []);
  console.log("Passed all seven palettes, persistence, dark mode, cross-route styling, mobile tiles, and Alpha reset.");
} finally {
  await browser.close();
}
