import { SubscriptionStatus } from "@/models/enums/subscription-status";

/**
 * Subscription state interface
 */
export interface SubscriptionState {
  status: SubscriptionStatus | undefined;
  isTrialExpired: boolean;
  hasPaymentMethod: boolean;
  isInvoicePaid: boolean;
}

/**
 * Status checks interface
 */
export interface StatusChecks {
  isInTrial: boolean;
  isActiveStatus: boolean;
  isPaymentIssueStatus: boolean;
  isInactiveStatus: boolean;
}

/**
 * Plan checks interface
 */
export interface PlanChecks {
  hasActivePlan: boolean;
  isTrialExpiredWithoutActivePlan: boolean;
  needsPayment: boolean;
}

