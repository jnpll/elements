export async function setAppearance(page, mode) {
  await page.getByRole("button", { name: "Select appearance", exact: true }).click();
  await page.getByRole("menuitemradio", { name: mode, exact: true }).click();
  await page.getByRole("menu").waitFor({ state: "hidden" });
}
export async function toggleAppearance(page) {
  await setAppearance(page, await page.locator("html").evaluate(el => el.classList.contains("dark")) ? "Light" : "Dark");
}
