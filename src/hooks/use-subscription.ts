import { useQuery } from "@tanstack/react-query";

import { getSubscription } from "@/services/payment/subscription";
import type {
  UseSubscriptionResult,
  SubscriptionData,
} from "@/models/interfaces/services/payment";
import { calculateSubscriptionStates } from "@/server/utils/subscription";

/**
 * Hook to fetch subscription data from Stripe
 *
 * Fetches data directly from Stripe API (source of truth).
 * Returns subscription status, trial information, and computed states.
 * Uses React Query for caching and automatic refetching.
 *
 * @returns UseSubscriptionResult with subscription data and computed states
 */
export function useSubscription(): UseSubscriptionResult {
  const { data, isLoading, error } = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: getSubscription,
  });

  const { trialTimeRemaining, subscriptionState, statusChecks, planChecks } =
    calculateSubscriptionStates(data);

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error as Error) : null,
    trialTimeRemaining,
    isTrialExpired: subscriptionState.isTrialExpired,
    hasActivePlan: planChecks.hasActivePlan,
    isTrialExpiredWithoutActivePlan: planChecks.isTrialExpiredWithoutActivePlan,
    isInTrial: statusChecks.isInTrial,
    isActiveStatus: statusChecks.isActiveStatus,
    isPaymentIssueStatus: statusChecks.isPaymentIssueStatus,
    isInactiveStatus: statusChecks.isInactiveStatus,
    needsPayment: planChecks.needsPayment,
  };
}
