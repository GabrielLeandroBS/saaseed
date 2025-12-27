"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import {
  format,
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subDays,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import {
  ptBR as ptBRDayPicker,
  enUS as enUSDayPicker,
} from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import { cn } from "@/lib/utils";

import {
  type DateRangePreset,
  type DateRangePickerProps,
  type DateRangePickerTranslations,
} from "@/models/interfaces/components/generic/calendar";
import { LocaleType } from "@/models/types/locale";

const getPresets = (
  translations: DateRangePickerTranslations["presets"],
): DateRangePreset[] => {
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
};

const getDateFnsLocale = (locale: LocaleType) => {
  return locale === "pt" ? ptBR : enUS;
};

const getDayPickerLocale = (locale: LocaleType) => {
  return locale === "pt" ? ptBRDayPicker : enUSDayPicker;
};

function DateRangePicker({
  defaultRange,
  onRangeChange,
  className,
  locale = "pt",
  translations,
}: DateRangePickerProps) {
  const dateFnsLocale = React.useMemo(() => getDateFnsLocale(locale), [locale]);
  const dayPickerLocale = React.useMemo(
    () => getDayPickerLocale(locale),
    [locale],
  );
  const presets = React.useMemo(
    () => getPresets(translations.presets),
    [translations.presets],
  );
  const [date, setDate] = React.useState<DateRange | undefined>(
    defaultRange || presets[4].getRange(),
  );
  const [month, setMonth] = React.useState<Date | undefined>(
    date?.from || new Date(),
  );

  React.useEffect(() => {
    if (onRangeChange) {
      onRangeChange(date);
    }
  }, [date, onRangeChange]);

  React.useEffect(() => {
    if (date?.from) {
      setMonth(date.from);
    }
  }, [date?.from]);

  const getActivePreset = React.useCallback(() => {
    if (!date?.from || !date?.to) return null;

    const fromTime = date.from.getTime();
    const toTime = date.to.getTime();

    return (
      presets.find((preset) => {
        const range = preset.getRange();
        if (!range.from || !range.to) return false;
        return (
          range.from.getTime() === fromTime && range.to.getTime() === toTime
        );
      }) || null
    );
  }, [date, presets]);

  const activePreset = getActivePreset();

  const handleDateChange = React.useCallback((range: DateRange | undefined) => {
    setDate(range);
    if (range?.from) {
      setMonth(range.from);
    }
  }, []);

  const handlePresetClick = React.useCallback((preset: DateRangePreset) => {
    const range = preset.getRange();
    setDate(range);
    if (range.from) {
      setMonth(range.from);
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "max-w-72 w-full justify-start text-left flex gap-2font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4" />

          <div className="items-center gap-2 hidden md:flex">
            {date?.from ? (
              date.to ? (
                <>
                  <Text as="span" size="sm">
                    {format(date.from, "dd MMM yyyy", {
                      locale: dateFnsLocale,
                    })}
                  </Text>
                  <Text as="span" size="sm">
                    {" "}
                    -{" "}
                  </Text>
                  <Text as="span" size="sm">
                    {format(date.to, "dd MMM yyyy", { locale: dateFnsLocale })}
                  </Text>
                </>
              ) : (
                <Text as="span" size="sm">
                  {format(date.from, "dd MMM yyyy", { locale: dateFnsLocale })}
                </Text>
              )
            ) : (
              <Text as="span" size="sm" color="muted">
                {translations.pickDateRange}
              </Text>
            )}
            <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="border-r p-2">
            <div className="flex flex-col space-y-1">
              {presets.map((preset) => {
                const isActive = activePreset?.label === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-left transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Text
                      as="span"
                      size="sm"
                      weight={isActive ? "medium" : "normal"}
                      color={isActive ? "default" : "default"}
                    >
                      {preset.label}
                    </Text>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-2">
            <Calendar
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={1}
              locale={dayPickerLocale}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker };
