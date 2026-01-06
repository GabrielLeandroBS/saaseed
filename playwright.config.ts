import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration
 *
 * Configured for Next.js application testing.
 * Runs tests against local dev server or CI environment.
 *
 * Features:
 * - Multi-browser support (Chromium, Firefox, WebKit)
 * - Video recording for all tests
 * - HTML report generation
 * - Automatic dev server startup
 *
 * Available scripts:
 * - pnpm test:e2e - Run all tests headless
 * - pnpm test:e2e:ui - Run with Playwright UI
 * - pnpm test:e2e:headed - Run with visible browser
 * - pnpm test:e2e:report - Open HTML report
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "on",
    video: "on",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
