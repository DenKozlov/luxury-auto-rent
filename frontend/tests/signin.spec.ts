import { test, expect, request } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth");
});

test.describe("sign in page", () => {
  test("should render the sign in page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Create Account" }),
    ).toBeVisible();
    await expect(page.getByText("Sign up to get started with")).toBeVisible();
    await expect(page.getByTestId("google-button")).toBeVisible();
    await expect(page.getByTestId("github-button")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Full Name" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    const backToHomeLink = page.getByRole("link", { name: "Back to Home" });
    await expect(backToHomeLink).toBeVisible();
    await backToHomeLink.click();
  });
  test("password input text should be masked/unmasked on click of eye icon", async ({
    page,
  }) => {
    const passwordInput = page.getByRole("textbox", { name: "Password" });
    const showPasswordButton = page.getByTestId("show-password-button");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await showPasswordButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await showPasswordButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });
  test.describe("sign in/up flow", () => {
    test.describe.configure({ mode: "serial" });
    test.afterAll(async () => {
      const context = await request.newContext();
      const response = await context.post(
        "http://localhost:3002/testing/reset",
      );
      expect(response.ok()).toBeTruthy();
      await context.dispose();
    });
    test("should sign up new user with login and password", async ({
      page,
    }) => {
      await page.getByRole("textbox", { name: "Password" }).fill("Qwert123!@");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("qqqqqqqqq@dddd.com");
      await page.getByRole("textbox", { name: "Full name" }).fill("Test Test");
      await page.getByRole("button", { name: "Sign up" }).click();
      await expect(page).toHaveURL("/");
    });
    test("login flow and redirect", async ({ page }) => {
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.fill('input[name="email"]', "qqqqqqqqq@dddd.com");
      await page.fill('input[name="password"]', "Qwert123!@");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL("/");
      await expect(
        page.getByRole("heading", { name: "The Zenith" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Sign in" }),
      ).not.toBeVisible();
    });
  });
});
