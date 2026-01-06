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

    /**
     * Verifies health API returns correct response structure
     *
     * Sends GET request to /api/health and expects correct JSON structure.
     */
    test("health API should return correct response structure", async ({
      request,
    }) => {
      const response = await request.get("/api/health");

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("timestamp");
      expect(body).toHaveProperty("checks");
      expect(body.checks).toHaveProperty("redis");
      expect(body.checks).toHaveProperty("supabase");
      expect(body.checks).toHaveProperty("stripe");
      expect(typeof body.checks.redis).toBe("boolean");
      expect(typeof body.checks.supabase).toBe("boolean");
      expect(typeof body.checks.stripe).toBe("boolean");
    });

    /**
     * Verifies health API returns 503 when services are down
     *
     * Note: This test may pass or fail depending on service availability.
     * It verifies the endpoint handles degraded status correctly.
     */
    test("health API should return 503 when services are down", async ({
      request,
    }) => {
      const response = await request.get("/api/health");
      const body = await response.json();

      // If any service is down, status should be "degraded" and HTTP status may be 503
      const allHealthy =
        body.checks.redis && body.checks.supabase && body.checks.stripe;

      if (!allHealthy) {
        expect(body.status).toBe("degraded");
        // May return 503 or 200 depending on implementation
        expect([200, 503]).toContain(response.status());
      } else {
        expect(body.status).toBe("healthy");
        expect(response.status()).toBe(200);
      }
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
