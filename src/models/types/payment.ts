/**
 * Payment result types
 *
 * Result types for Stripe customer operations.
 */

import type Stripe from "stripe";

/** Result type for customer sync operations */
export type CustomerSyncResult =
  | { customer: Stripe.Customer; isNew: boolean; error?: never }
  | { customer?: never; isNew?: never; error: Error };

/** Result type for customer existence check */
export type CustomerExistsResult =
  | { exists: boolean; error: null }
  | { exists: false; error: Error };

/** Result type for get customer operations */
export type GetCustomerResult =
  | { customer: Stripe.Customer; error?: never }
  | { customer?: never; error: Error };

/** Result type for delete customer operations */
export type DeleteCustomerResult =
  | { success: true; error?: never }
  | { success?: never; error: Error };
