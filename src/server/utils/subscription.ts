import { SubscriptionStatus } from "@/models/enums/subscription-status";
import type {
  SubscriptionData,
  TrialTimeRemaining,
} from "@/models/interfaces/services/payment";
import type {
  SubscriptionState,
  StatusChecks,
  PlanChecks,
} from "@/models/interfaces/subscription";
import {
  PAYMENT_ISSUE_STATUSES,
  INACTIVE_STATUSES,
} from "@/models/constants/subscription";

/**
 * Calculates remaining trial time from trial end date
 *
 * @param trialEnd - Trial end date as ISO string
 * @returns Trial time remaining with days and expiration status, or null if no trial
 */
export function calculateTrialTimeRemaining(
  trialEnd: string | null
): TrialTimeRemaining | null {
  if (!trialEnd) return null;

  const trialEndDate = new Date(trialEnd);
  const now = new Date();
  const diff = trialEndDate.getTime() - now.getTime();

  const isExpired = diff <= 0;
  const days = isExpired ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    isExpired,
  };
}

/**
 * Creates subscription state from subscription data
 *
 * @param data - Subscription data from Stripe
 * @param trialTimeRemaining - Calculated trial time remaining
 * @returns Subscription state object
 */
export function createSubscriptionState(
  data: SubscriptionData | null | undefined,
  trialTimeRemaining: TrialTimeRemaining | null
): SubscriptionState {
  return {
    status: data?.status,
    isTrialExpired: trialTimeRemaining?.isExpired ?? false,
    hasPaymentMethod: data?.hasPaymentMethod ?? false,
    isInvoicePaid: data?.latestInvoice?.paid ?? false,
  };
}

/**
 * Calculates status checks from subscription state
 *
 * @param subscriptionState - Subscription state object
 * @returns Status checks object
 */
export function calculateStatusChecks(
  subscriptionState: SubscriptionState
): StatusChecks {
  const status = subscriptionState.status;

  return {
    isInTrial: status === SubscriptionStatus.TRIALING,
    isActiveStatus:
      status === SubscriptionStatus.ACTIVE ||
      status === SubscriptionStatus.TRIALING,
    isPaymentIssueStatus:
      status !== undefined && PAYMENT_ISSUE_STATUSES.includes(status),
    isInactiveStatus:
      status !== undefined && INACTIVE_STATUSES.includes(status),
  };
}

/**
 * Calculates plan checks from subscription state and status checks
 *
 * @param subscriptionState - Subscription state object
 * @param statusChecks - Status checks object
 * @returns Plan checks object
 */
export function calculatePlanChecks(
  subscriptionState: SubscriptionState,
  statusChecks: StatusChecks
): PlanChecks {
  const hasActivePlan =
    subscriptionState.status === SubscriptionStatus.ACTIVE &&
    !statusChecks.isInTrial &&
    (subscriptionState.hasPaymentMethod || subscriptionState.isInvoicePaid);

  return {
    hasActivePlan,
    isTrialExpiredWithoutActivePlan:
      (subscriptionState.isTrialExpired || statusChecks.isPaymentIssueStatus) &&
      !hasActivePlan &&
      (!subscriptionState.hasPaymentMethod || !subscriptionState.isInvoicePaid),
    needsPayment:
      statusChecks.isPaymentIssueStatus ||
      (subscriptionState.isTrialExpired &&
        !subscriptionState.hasPaymentMethod &&
        !subscriptionState.isInvoicePaid),
  };
}

/**
 * Calculates all subscription states and checks from subscription data
 *
 * Convenience function that combines all calculations in one call.
 * Useful for server routes and hooks.
 *
 * @param data - Subscription data from Stripe
 * @returns Object with all subscription states, status checks, and plan checks
 */
export function calculateSubscriptionStates(
  data: SubscriptionData | null | undefined
) {
  const trialTimeRemaining = calculateTrialTimeRemaining(
    data?.trialEnd ?? null
  );
  const subscriptionState = createSubscriptionState(data, trialTimeRemaining);
  const statusChecks = calculateStatusChecks(subscriptionState);
  const planChecks = calculatePlanChecks(subscriptionState, statusChecks);

  return {
    trialTimeRemaining,
    subscriptionState,
    statusChecks,
    planChecks,
  };
}

