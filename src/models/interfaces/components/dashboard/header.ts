/**
 * Dashboard header interfaces
 *
 * Interfaces for dashboard header component props.
 */

import type { DictionaryType } from "@/models/types/i18n";

/**
 * Props for DashboardHeader component
 */
export interface DashboardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  translation: DictionaryType;
}
