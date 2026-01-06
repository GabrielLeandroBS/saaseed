import { NextRequest } from "next/server";
import { handleGetSubscription } from "@/server/routes/subscription/handler";

/**
 * GET handler for subscription API route
 *
 * Retrieves user subscription data from Stripe.
 * Requires authentication.
 *
 * @param request - Next.js request object
 * @returns Subscription data or error response
 */
export async function GET(request: NextRequest) {
  return handleGetSubscription(request);
}
