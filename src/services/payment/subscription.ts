import type { SubscriptionData } from "@/models/interfaces/services/payment";

/**
 * Fetches subscription data from the API
 *
 * Retrieves the current user's subscription status, trial info,
 * payment method, and latest invoice from Stripe.
 *
 * @returns Promise resolving to subscription data
 * @throws Error if subscription fetch fails
 */
export async function getSubscription(): Promise<SubscriptionData> {
  const response = await fetch("/api/subscription", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { message: response.statusText },
    }));
    throw new Error(error.error?.message || "Failed to fetch subscription");
  }

  return response.json();
}
