import { type ReactNode } from "react";

export interface SearchTranslations {
  placeholder: string;
  dialogPlaceholder: string;
  noResults: string;
  suggestions: string;
  ariaLabel: string;
}

export interface SearchRenderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SearchProps {
  translations: SearchTranslations;
  shortcutKey?: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: ReactNode | ((props: SearchRenderProps) => ReactNode);
}
