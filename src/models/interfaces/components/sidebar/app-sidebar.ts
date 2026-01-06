/**
 * App sidebar interfaces
 *
 * Interfaces for application sidebar component props.
 */

import { ReactNode } from "react";

import { Sidebar } from "@/components/ui/sidebar";

import type { DictionaryType } from "@/models/types/i18n";

import { NavMainItemProps } from "./nav-main";
import { NavSecondaryItemProps } from "./nav-secondary";

/**
 * Props for AppSidebar component
 */
export interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  translation: DictionaryType;
  token?: string;
  children?: ReactNode;
}

/**
 * Team data configuration
 */
export interface TeamData {
  name: string;
  logo: React.ElementType;
  plan: string;
}

/**
 * Sidebar mock data structure
 */
export interface SidebarMockData {
  navMain: NavMainItemProps[];
  navSecondary: NavSecondaryItemProps[];
  teams: TeamData[];
}
