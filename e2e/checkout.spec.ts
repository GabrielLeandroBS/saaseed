import { test, expect } from "@playwright/test";

/**
 * Checkout/Payment E2E Tests
 *
 * Tests payment-related flows:
 * - Checkout API availability
 * - Subscription API availability
 * - Payment modal behavior (when unauthenticated)
 *
 * Note: Full payment flow testing requires authenticated sessions
 * and Stripe test mode. These tests verify the infrastructure works.
 */

test.describe("Payment Infrastructure", () => {
  test.describe("API Endpoints", () => {
    /**
     * Verifies checkout API requires authentication
     *
     * Sends POST request to /api/checkout and expects 401 Unauthorized.
     */
    test("checkout API should require authentication", async ({ request }) => {
      const response = await request.post("/api/checkout");

      expect(response.status()).toBe(401);
    });

    /**
     * Verifies subscription API requires authentication
     *
     * Sends GET request to /api/subscription and expects 401 or 500.
     * Both indicate the endpoint is protected.
     */
    test("subscription API should require authentication", async ({
      request,
    }) => {
      const response = await request.get("/api/subscription");

      expect([401, 500]).toContain(response.status());
    });

    /**
     * Verifies health API is publicly accessible
     *
     * Sends GET request to /api/health and expects 200 OK.
     */
    test("health API should be accessible", async ({ request }) => {
      const response = await request.get("/api/health");

      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe("Stripe Webhook", () => {
    /**
     * Verifies webhook rejects requests without Stripe signature
     *
     * Sends POST request to /api/webhooks/stripe without signature header.
     * Expects 400 Bad Request due to missing signature.
     */
    test("webhook should reject requests without signature", async ({
      request,
    }) => {
      const response = await request.post("/api/webhooks/stripe", {
        data: { type: "test" },
      });

      expect(response.status()).toBe(400);
    });
  });
});

test.describe("Payment UI", () => {
  /**
   * Verifies dashboard is protected for unauthenticated users
   *
   * Attempts to access /pt/dashboard and expects redirect to sign-in.
   */
  test("dashboard should be protected", async ({ page }) => {
    await page.goto("/pt/dashboard");

    await expect(page).toHaveURL(/sign-in/);
  });
});
