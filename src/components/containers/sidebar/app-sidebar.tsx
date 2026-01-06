"use client";

import * as React from "react";
import { Building2, LifeBuoy, Rocket, Search, Send } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/containers/sidebar/nav-main";
import { NavSecondary } from "@/components/containers/sidebar/nav-secondary";
import { NavUser } from "@/components/containers/sidebar/nav-user";
import { TeamSwitcher } from "@/components/containers/sidebar/team-switcher";

import { SidebarProps } from "@/models/interfaces/components/sidebar/app-sidebar";

/**
 * Main application sidebar component
 *
 * Displays navigation, teams, and user information.
 *
 * @param translation - Translation dictionary for sidebar labels
 * @param props - Additional sidebar props
 */
export function AppSidebar({ translation, ...props }: SidebarProps) {
  const sidebarData = {
    navMain: [
      {
        title: translation.sidebar.navMain.search,
        url: "/dashboard/search",
        icon: Search,
        isActive: true,
      },
    ],
    navSecondary: [
      {
        title: translation.sidebar.navSecondary.support,
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: translation.sidebar.navSecondary.feedback,
        url: "#",
        icon: Send,
      },
    ],
    teams: [
      {
        name: "Acme Inc",
        logo: Rocket,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: Building2,
        plan: "Startup",
      },
    ],
  };

  return (
    <Sidebar variant="inset" className="" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain translation={translation} items={sidebarData.navMain} />

        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

AppSidebar.displayName = "AppSidebar";
