import { ReactNode } from "react";

import { Sidebar } from "@/components/ui/sidebar";

import { DictionaryType } from "@/lib/get/dictionaries";

import { NavMainItemProps } from "./nav-main";
import { NavSecondaryItemProps } from "./nav-secondary";

export interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  translation: DictionaryType;
  token?: string;
  children?: ReactNode;
}

export interface TeamData {
  name: string;
  logo: React.ElementType;
  plan: string;
}

export interface SidebarMockData {
  navMain: NavMainItemProps[];
  navSecondary: NavSecondaryItemProps[];
  teams: TeamData[];
}
