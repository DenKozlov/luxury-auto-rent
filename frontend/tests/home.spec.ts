import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("home page is loaded", async ({ page }) => {
  const recommendedResponse = page.waitForResponse(
    (res) => res.url().includes("/cars/recommended") && res.status() === 200,
  );
  await expect(page.getByRole("heading", { name: "The Zenith" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Fleet" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ZENITH Logo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
  await recommendedResponse;
});

test.describe("home page interactions", () => {
  test("should navigate to the cars page", async ({ page }) => {
    await page.getByRole("link", { name: "Explore Fleet" }).click();
    await expect(page).toHaveURL(/\/cars/);
  });
  test("should navigate to the car details page", async ({ page }) => {
    const recommendedResponse = page.waitForResponse(
      (res) => res.url().includes("/cars/recommended") && res.status() === 200,
    );
    await recommendedResponse;
    const firstCarLink = page.getByTestId("car-card-link").first();
    const href = await firstCarLink.getAttribute("href");

    await firstCarLink.click();
    await expect(page).toHaveURL(href as string);
  });
  test("should navigate to the sign in page", async ({ page }) => {
    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/auth/);
  });
});
