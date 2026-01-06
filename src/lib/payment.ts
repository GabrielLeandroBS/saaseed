/**
 * Payment formatting utilities
 *
 * Client-side utilities for formatting payment amounts and currencies.
 */

import type { FormatAmountParams } from "@/models/interfaces/components/features/payment-required-modal";

/**
 * Formats a payment amount with currency
 *
 * Converts amount from cents to currency format using Intl.NumberFormat.
 *
 * @param params - Parameters containing amount, currency, and optional locale
 * @returns Formatted currency string
 */
export function formatAmount({
  amount,
  currency,
  locale = "en-US",
}: FormatAmountParams): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
