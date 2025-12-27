import { type DateRange } from "react-day-picker";

import { LocaleType } from "@/models/types/locale";

export interface DateRangePreset {
  label: string;
  getRange: () => DateRange;
}

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

export interface DateRangePickerProps {
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  className?: string;
  locale?: LocaleType;
  translations: DateRangePickerTranslations;
}
