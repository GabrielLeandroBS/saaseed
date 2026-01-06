/**
 * Checkout API Schemas
 *
 * Zod schemas for validating Checkout API responses.
 */

import { z } from "@/lib/zod";

/**
 * Schema for Checkout API response
 */
export const CheckoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
});

/** Inferred type for Checkout response */
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
