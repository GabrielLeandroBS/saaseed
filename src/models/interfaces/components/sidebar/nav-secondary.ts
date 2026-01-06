/**
 * Nav secondary interfaces
 *
 * Interfaces for secondary navigation component props.
 */

import { LucideIcon } from "lucide-react";

/**
 * Secondary navigation item configuration
 */
export interface NavSecondaryItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

/**
 * Props for NavSecondary component
 */
export interface NavSecondaryProps extends React.HTMLAttributes<HTMLElement> {
  items: NavSecondaryItemProps[];
}
