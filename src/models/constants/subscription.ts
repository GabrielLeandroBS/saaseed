import { SubscriptionStatus } from "@/models/enums/subscription-status";

/**
 * Subscription status constants
 *
 * Provides reusable constants for subscription status checks.
 * Can be used in both client hooks and server routes.
 */

/**
 * Status values that indicate payment issues
 */
export const PAYMENT_ISSUE_STATUSES: readonly SubscriptionStatus[] = [
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.UNPAID,
  SubscriptionStatus.INCOMPLETE,
  SubscriptionStatus.INCOMPLETE_EXPIRED,
] as const;

/**
 * Status values that indicate inactive subscription
 */
export const INACTIVE_STATUSES: readonly SubscriptionStatus[] = [
  SubscriptionStatus.CANCELED,
  SubscriptionStatus.PAUSED,
] as const;
