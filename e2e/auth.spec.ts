import { test, expect } from "@playwright/test";

/**
 * Authentication E2E Tests
 *
 * Tests critical authentication flows:
 * - Sign in page accessibility
 * - Sign up page accessibility
 * - Magic link form submission
 * - OAuth buttons presence
 * - Protected route redirection
 */

test.describe("Authentication", () => {
  test.describe("Sign In Page", () => {
    /**
     * Verifies sign in page loads correctly
     *
     * Checks URL contains sign-in path and email input is visible.
     */
    test("should display sign in page", async ({ page }) => {
      await page.goto("/pt/sign-in");

      await expect(page).toHaveURL(/sign-in/);
      await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    });

    /**
     * Verifies Google OAuth button is present
     *
     * Checks the Google authentication button is visible on sign in page.
     */
    test("should have Google OAuth button", async ({ page }) => {
      await page.goto("/pt/sign-in");

      const googleButton = page.getByRole("button", { name: /google/i });
      await expect(googleButton).toBeVisible();
    });

    /**
     * Verifies email validation on form submission
     *
     * Submits an invalid email and checks user stays on sign-in page.
     */
    test("should validate email format", async ({ page }) => {
      await page.goto("/pt/sign-in");

      const emailInput = page.getByRole("textbox", { name: /email/i });
      const submitButton = page.getByRole("button", {
        name: "Entrar",
        exact: true,
      });

      await emailInput.fill("invalid-email");
      await submitButton.click();

      await expect(page).toHaveURL(/sign-in/);
    });

    /**
     * Verifies valid email is accepted for magic link
     *
     * Fills a valid email and checks the input value is set correctly.
     */
    test("should accept valid email for magic link", async ({ page }) => {
      await page.goto("/pt/sign-in");

      const emailInput = page.getByRole("textbox", { name: /email/i });

      await emailInput.fill("test@example.com");

      await expect(emailInput).toHaveValue("test@example.com");
    });
  });

  test.describe("Sign Up Page", () => {
    /**
     * Verifies sign up page loads correctly
     *
     * Checks URL contains sign-up path and email input is visible.
     */
    test("should display sign up page", async ({ page }) => {
      await page.goto("/pt/sign-up");

      await expect(page).toHaveURL(/sign-up/);
      await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    });

    /**
     * Verifies link to sign in page exists
     *
     * Checks there's a visible link to navigate to sign in page.
     */
    test("should have link to sign in", async ({ page }) => {
      await page.goto("/pt/sign-up");

      const signInLink = page.getByRole("link", {
        name: /entrar|sign in|já tem conta/i,
      });
      await expect(signInLink).toBeVisible();
    });
  });

  test.describe("Protected Routes", () => {
    /**
     * Verifies unauthenticated users are redirected from dashboard
     *
     * Attempts to access dashboard without auth and checks redirect to sign-in.
     */
    test("should redirect unauthenticated users from dashboard", async ({
      page,
    }) => {
      await page.goto("/pt/dashboard");

      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe("Internationalization", () => {
    /**
     * Verifies Portuguese locale sign in page
     *
     * Navigates to /pt/sign-in and checks URL is correct.
     */
    test("should load Portuguese sign in page", async ({ page }) => {
      await page.goto("/pt/sign-in");
      await expect(page).toHaveURL(/\/pt\/sign-in/);
    });

    /**
     * Verifies English locale sign in page
     *
     * Navigates to /en/sign-in and checks URL is correct.
     */
    test("should load English sign in page", async ({ page }) => {
      await page.goto("/en/sign-in");
      await expect(page).toHaveURL(/\/en\/sign-in/);
    });

    /**
     * Verifies root URL redirects to a locale
     *
     * Navigates to root and checks redirect to /pt or /en.
     */
    test("should redirect root to locale", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveURL(/\/(pt|en)/);
    });
  });
});
