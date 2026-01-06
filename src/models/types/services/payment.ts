/**
 * Payment service types
 *
 * Internal result types for payment service operations.
 */

import type Stripe from "stripe";

/**
 * Result type for customer operations
 */
export type CustomerResult =
  | { customer: Stripe.Customer; error?: never }
  | { customer?: never; error: Error };
