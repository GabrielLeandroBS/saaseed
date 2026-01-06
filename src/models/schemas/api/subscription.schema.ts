/**
 * Subscription API Schemas
 *
 * Zod schemas for validating Subscription API responses.
 */

import { z } from "@/lib/zod";
import { SubscriptionStatus } from "@/models/enums/subscription-status";

/**
 * Schema for payment method card details
 */
const PaymentMethodCardSchema = z.object({
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number(),
  expYear: z.number(),
});

/**
 * Schema for payment method
 */
const PaymentMethodSchema = z.object({
  type: z.string(),
  card: PaymentMethodCardSchema.nullable(),
});

/**
 * Schema for invoice details
 */
const InvoiceSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  paid: z.boolean(),
  dueDate: z.string().nullable(),
});

/**
 * Schema for Subscription API response
 */
export const SubscriptionResponseSchema = z.object({
  status: z.nativeEnum(SubscriptionStatus),
  trialEnd: z.string().nullable(),
  trialStart: z.string().nullable(),
  currentPeriodEnd: z.string().nullable(),
  currentPeriodStart: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  hasPaymentMethod: z.boolean(),
  paymentMethod: PaymentMethodSchema.nullable(),
  latestInvoice: InvoiceSchema.nullable(),
  subscriptionId: z.string(),
  customerId: z.string(),
});

/** Inferred type for Subscription response */
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
