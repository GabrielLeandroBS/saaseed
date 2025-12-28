import * as React from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxTranslations {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
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
