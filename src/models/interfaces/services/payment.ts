/**
 * Payment service interfaces
 *
 * Interfaces for Stripe payment operations and subscription management.
 */

import { SubscriptionStatus } from "@/models/enums/subscription-status";

/**
 * Parameters for creating a Stripe customer
 */
export interface CreateCustomerParams {
  email: string;
  name?: string | null;
  metadata?: Record<string, string>;
}

/**
 * Parameters for syncing customer to Stripe
 */
export interface SyncCustomerParams {
  email: string;
  name?: string | null;
  metadata?: Record<string, string>;
  userId?: string;
}

/**
 * Parameters for creating subscription with trial
 */
export interface CreateSubscriptionWithTrialParams {
  customerId: string;
  priceId: string;
  trialPeriodDays?: number;
  userId?: string;
}

/**
 * Payment method card details
 */
export interface PaymentMethodCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

/**
 * Payment method interface
 */
export interface PaymentMethod {
  type: string;
  card: PaymentMethodCard | null;
}

/**
 * Invoice interface
 */
export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paid: boolean;
  dueDate: string | null;
}

/**
 * Subscription data from Stripe
 */
export interface SubscriptionData {
  status: SubscriptionStatus;
  trialEnd: string | null;
  trialStart: string | null;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  cancelAtPeriodEnd: boolean;
  hasPaymentMethod: boolean;
  paymentMethod: PaymentMethod | null;
  latestInvoice: Invoice | null;
  subscriptionId: string;
  customerId: string;
}

/**
 * Trial time remaining calculation result
 */
export interface TrialTimeRemaining {
  days: number;
  isExpired: boolean;
}

/**
 * Result type for useSubscription hook
 */
export interface UseSubscriptionResult {
  data: SubscriptionData | null;
  isLoading: boolean;
  error: Error | null;
  trialTimeRemaining: TrialTimeRemaining | null;
  isTrialExpired: boolean;
  hasActivePlan: boolean;
  isTrialExpiredWithoutActivePlan: boolean;
  isInTrial: boolean;
  isActiveStatus: boolean;
  isPaymentIssueStatus: boolean;
  isInactiveStatus: boolean;
  needsPayment: boolean;
}
