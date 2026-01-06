/**
 * Sitemap types
 *
 * Types for sitemap generation and configuration.
 */

/**
 * Change frequency for sitemap entries
 */
export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
