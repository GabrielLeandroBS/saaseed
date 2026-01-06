"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { Text } from "@/components/ui/text";
import type { TrialInfoProps } from "@/models/interfaces/components/features/trial-info";
import { getTrialContent } from "@/lib/trial";

/**
 * Component to display trial time remaining
 *
 * Fetches subscription data directly from Stripe (source of truth).
 * Shows trial days remaining or active subscription status.
 *
 * @param translation - Optional translation object for i18n support
 * @returns JSX element with trial information
 */
export function TrialInfo({ translation }: TrialInfoProps) {
  const {
    data,
    isLoading,
    trialTimeRemaining,
    isTrialExpiredWithoutActivePlan,
  } = useSubscription();

  const content = getTrialContent({
    isLoading,
    data,
    trialTimeRemaining,
    isTrialExpiredWithoutActivePlan,
    translation,
  });

  if (!content) {
    return null;
  }

  return (
    <Text as="h1" size="lg" className={content.className}>
      {content.text}
    </Text>
  );
}

TrialInfo.displayName = "TrialInfo";
