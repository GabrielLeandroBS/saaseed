import { NextRequest } from "next/server";
import { handleStripeWebhook } from "@/server/routes/webhooks/stripe/handler";

/**
 * POST handler for Stripe webhook events
 *
 * Processes webhook events from Stripe (subscription updates, invoices, etc.).
 * Handles subscription status synchronization with Supabase.
 *
 * @param req - Next.js request object containing webhook payload
 * @returns Response indicating webhook processing status
 */
export async function POST(req: NextRequest) {
  return handleStripeWebhook(req);
}
