/**
 * Calendar interfaces
 *
 * Interfaces for date range picker component props.
 */

import { type DateRange } from "react-day-picker";

import { LocaleType } from "@/models/types/locale";

/**
 * Date range preset configuration
 */
export interface DateRangePreset {
  label: string;
  getRange: () => DateRange;
}

/**
 * Translations for date range picker
 */
export interface DateRangePickerTranslations {
  pickDateRange: string;
  presets: {
    today: string;
    yesterday: string;
    thisWeek: string;
    last7Days: string;
    last28Days: string;
    thisMonth: string;
    lastMonth: string;
    thisYear: string;
  };
}

/**
 * Props for DateRangePicker component
 */
export interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  locale?: LocaleType;
  translations: DateRangePickerTranslations;
}
