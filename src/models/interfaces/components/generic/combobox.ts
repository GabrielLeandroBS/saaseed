/**
 * Combobox interfaces
 *
 * Interfaces for combobox component props.
 */

import * as React from "react";

/**
 * Combobox option configuration
 */
export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Translations for combobox component
 */
export interface ComboboxTranslations {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

/**
 * Props for Combobox component
 */
export interface ComboboxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  options: ComboboxOption[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSelect?: (value: string) => void;
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  translations?: ComboboxTranslations;
  className?: string;
}
