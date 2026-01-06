/**
 * Nav main interfaces
 *
 * Interfaces for main navigation component props.
 */

import { LucideIcon } from "lucide-react";

import type { DictionaryType } from "@/models/types/i18n";

/**
 * Navigation item configuration
 */
export interface NavMainItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

/**
 * Props for NavMain component
 */
export interface NavMainProps extends React.HTMLAttributes<HTMLElement> {
  items: NavMainItemProps[];
  translation: DictionaryType;
}
