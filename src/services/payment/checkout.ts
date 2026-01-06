import type { CheckoutResponse } from "@/models/schemas/api/checkout.schema";

/**
 * Creates a Stripe checkout session
 *
 * Calls the checkout API to create a billing portal session.
 * Used when user needs to add payment method or pay pending invoice.
 *
 * @returns Promise resolving to checkout response with URL
 * @throws Error if checkout session creation fails
 */
export async function createCheckoutSession(): Promise<CheckoutResponse> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { message: response.statusText },
    }));
    throw new Error(
      error.error?.message || "Failed to create checkout session"
    );
  }

  return response.json();
}
