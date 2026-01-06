import { test as setup } from "@playwright/test";

/**
 * Global Setup for E2E Tests
 *
 * Runs once before all tests.
 * Can be used to:
 * - Seed test data
 * - Create authenticated sessions
 * - Set up test environment
 */

/**
 * Verifies application is running before tests
 *
 * Checks /api/health endpoint is accessible.
 * Throws error if app is not running.
 */
setup("global setup", async ({ page }) => {
  const response = await page.goto("/api/health");
  if (!response?.ok()) {
    throw new Error("App is not running. Start with: pnpm dev");
  }

  console.log("✅ App is healthy and ready for tests");
});
