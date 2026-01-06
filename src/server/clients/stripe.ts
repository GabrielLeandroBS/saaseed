import Stripe from "stripe";
import { env } from "@/env";

/**
 * Stripe client for server-side payment operations
 *
 * ⚠️ IMPORTANT: Only use this on the server-side!
 * Never expose STRIPE_SECRET_KEY to the client-side!
 *
 * This client is used for:
 * - Creating customers and subscriptions
 * - Handling webhooks
 * - Managing payment methods
 * - Administrative operations
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});
