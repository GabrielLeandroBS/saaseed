/**
 * Trial formatting utilities
 *
 * Client-side utilities for formatting and displaying trial information.
 */

import { SubscriptionStatus } from "@/models/enums/subscription-status";
import type {
  TrialContentResult,
  FormatDaysParams,
  GetTrialContentParams,
} from "@/models/interfaces/components/features/trial-info";

/**
 * Formats trial days remaining into a localized string
 *
 * @param params - Parameters containing days and optional translation
 * @returns Formatted string representing days remaining
 */
export function formatDays({ days, translation }: FormatDaysParams): string {
  if (days <= 0) {
    return translation?.trial.lessThanOneDay ?? "less than 1 day";
  }
  const dayLabel =
    days === 1
      ? (translation?.trial.day ?? "day")
      : (translation?.trial.days ?? "days");
  return `${days} ${dayLabel}`;
}

/**
 * Gets trial content to display based on subscription state
 *
 * Determines the appropriate text and styling class based on trial status,
 * loading state, and expiration information.
 *
 * @param params - Parameters containing subscription state and translations
 * @returns Trial content result with text and className, or null if not in trial
 */
export function getTrialContent({
  isLoading,
  data,
  trialTimeRemaining,
  isTrialExpiredWithoutActivePlan,
  translation,
}: GetTrialContentParams): TrialContentResult | null {
  if (isLoading) {
    return {
      text: translation?.trial.loading ?? "Loading trial information...",
      className: "text-muted-foreground",
    };
  }

  if (isTrialExpiredWithoutActivePlan) {
    return {
      text:
        translation?.trial.expiredNoPlan ??
        "Trial expired - Add a payment method",
      className: "text-destructive font-semibold",
    };
  }

  const isInTrial = data?.status === SubscriptionStatus.TRIALING;

  if (!data || !isInTrial) {
    return null;
  }

  if (!trialTimeRemaining) {
    return {
      text: translation?.trial.active ?? "Trial active",
      className: "text-muted-foreground",
    };
  }

  if (trialTimeRemaining.isExpired) {
    return {
      text: translation?.trial.expired ?? "Trial expired",
      className: "text-destructive font-semibold",
    };
  }

  const daysText = formatDays({
    days: trialTimeRemaining.days,
    translation,
  });
  const remainingText =
    translation?.trial.remaining ?? "Trial: {{days}} remaining";
  const text = remainingText.replace("{{days}}", daysText);

  return {
    text,
    className: "font-semibold",
  };
}

