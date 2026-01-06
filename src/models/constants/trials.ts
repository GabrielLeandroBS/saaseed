/**
 * Trial configuration constants
 *
 * Defines trial period settings for new subscriptions.
 */

/**
 * Trial configuration
 * @property DEFAULT_DAYS - Default trial period in days
 * @property MILLISECONDS_PER_DAY - Milliseconds in a day (for calculations)
 */
export const TRIAL_CONFIG = {
  DEFAULT_DAYS: 7,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
} as const;
