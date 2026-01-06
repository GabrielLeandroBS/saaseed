/**
 * Trial info component interfaces
 *
 * Interfaces for trial information display component.
 */

import type { DashboardDictionary } from "@/models/types/i18n";
import type {
  SubscriptionData,
  TrialTimeRemaining,
} from "@/models/interfaces/services/payment";

/**
 * Trial content result interface
 */
export interface TrialContentResult {
  text: string;
  className: string;
}

/**
 * Props for TrialInfo component
 */
export interface TrialInfoProps {
  translation?: {
    trial: DashboardDictionary["trial"];
  };
}

/**
 * Parameters for formatDays function
 */
export interface FormatDaysParams {
  days: number;
  translation?: TrialInfoProps["translation"];
}

/**
 * Parameters for getTrialContent function
 */
export interface GetTrialContentParams {
  isLoading: boolean;
  data: SubscriptionData | null;
  trialTimeRemaining: TrialTimeRemaining | null;
  isTrialExpiredWithoutActivePlan: boolean;
  translation?: TrialInfoProps["translation"];
}

