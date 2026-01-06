/**
 * Calendar formatting utilities
 *
 * Client-side utilities for date formatting and locale handling.
 */

import { startOfToday } from "date-fns/startOfToday";
import { endOfToday } from "date-fns/endOfToday";
import { startOfYesterday } from "date-fns/startOfYesterday";
import { endOfYesterday } from "date-fns/endOfYesterday";
import { startOfWeek } from "date-fns/startOfWeek";
import { endOfWeek } from "date-fns/endOfWeek";
import { startOfMonth } from "date-fns/startOfMonth";
import { endOfMonth } from "date-fns/endOfMonth";
import { startOfYear } from "date-fns/startOfYear";
import { endOfYear } from "date-fns/endOfYear";
import { subMonths } from "date-fns/subMonths";
import { subDays } from "date-fns/subDays";
import { ptBR } from "date-fns/locale/pt-BR";
import { enUS } from "date-fns/locale/en-US";
import {
  ptBR as ptBRDayPicker,
  enUS as enUSDayPicker,
} from "react-day-picker/locale";
import { LocaleType } from "@/models/types/locale";
import type {
  DateRangePreset,
  DateRangePickerTranslations,
} from "@/models/interfaces/components/generic/calendar";

/**
 * Generates date range presets with translations
 *
 * Creates preset options for common date ranges (today, yesterday, this week, etc.).
 *
 * @param translations - Translation dictionary for preset labels
 * @returns Array of date range presets
 */
export function getPresets(
  translations: DateRangePickerTranslations["presets"]
): DateRangePreset[] {
  const today = startOfToday();
  const yesterday = startOfYesterday();

  return [
    {
      label: translations.today,
      getRange: () => ({
        from: today,
        to: endOfToday(),
      }),
    },
    {
      label: translations.yesterday,
      getRange: () => ({
        from: yesterday,
        to: endOfYesterday(),
      }),
    },
    {
      label: translations.thisWeek,
      getRange: () => ({
        from: startOfWeek(today, { weekStartsOn: 0 }),
        to: endOfWeek(today, { weekStartsOn: 0 }),
      }),
    },
    {
      label: translations.last7Days,
      getRange: () => ({
        from: subDays(today, 6),
        to: endOfToday(),
      }),
    },
    {
      label: translations.last28Days,
      getRange: () => ({
        from: subDays(today, 27),
        to: endOfToday(),
      }),
    },
    {
      label: translations.thisMonth,
      getRange: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    {
      label: translations.lastMonth,
      getRange: () => {
        const lastMonth = subMonths(today, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
    {
      label: translations.thisYear,
      getRange: () => ({
        from: startOfYear(today),
        to: endOfYear(today),
      }),
    },
  ];
}

/**
 * Gets date-fns locale based on locale type
 *
 * @param locale - Locale type ("pt" or "en")
 * @returns date-fns locale object
 */
export function getDateFnsLocale(locale: LocaleType) {
  return locale === "pt" ? ptBR : enUS;
}

/**
 * Gets react-day-picker locale based on locale type
 *
 * @param locale - Locale type ("pt" or "en")
 * @returns react-day-picker locale object
 */
export function getDayPickerLocale(locale: LocaleType) {
  return locale === "pt" ? ptBRDayPicker : enUSDayPicker;
}
