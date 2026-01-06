"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imported DateRangePicker component
 *
 * Reduces initial bundle size by lazy-loading date-fns and react-day-picker (~50-70KB).
 * Only loads when calendar is actually opened by the user.
 * SSR is disabled as date pickers require client-side JavaScript.
 */
export const DateRangePicker = dynamic(
  () =>
    import("@/components/containers/generic/calendar").then((mod) => ({
      default: mod.DateRangePicker,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-10 lg:w-64 animate-pulse rounded-md bg-muted" />
    ),
  }
);
