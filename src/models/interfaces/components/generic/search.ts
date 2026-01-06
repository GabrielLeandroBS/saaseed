/**
 * Search interfaces
 *
 * Interfaces for search component props.
 */

import { type ReactNode } from "react";

/**
 * Translations for search component
 */
export interface SearchTranslations {
  placeholder: string;
  dialogPlaceholder: string;
  noResults: string;
  suggestions: string;
  ariaLabel: string;
}

/**
 * Render props for search component children
 */
export interface SearchRenderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Props for Search component
 */
export interface SearchProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  translations: SearchTranslations;
  shortcutKey?: string;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode | ((props: SearchRenderProps) => ReactNode);
}
