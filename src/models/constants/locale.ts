/**
 * Locale constants
 *
 * Constants for supported locales in the application.
 */

import type { LocaleType } from "@/models/types/locale";

/**
 * Array of supported locales
 */
export const SUPPORTED_LOCALES: readonly LocaleType[] = ["pt", "en"] as const;

/**
 * Default locale
 */
export const DEFAULT_LOCALE: LocaleType = "pt";

