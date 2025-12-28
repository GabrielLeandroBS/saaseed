"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/container/sidebar/nav-main";
import { NavSecondary } from "@/components/container/sidebar/nav-secondary";
import { NavUser } from "@/components/container/sidebar/nav-user";
import { TeamSwitcher } from "@/components/container/sidebar/team-switcher";

import { SidebarProps } from "@/models/interfaces/components/sidebar/app-sidebar";
import { getSidebarMockData } from "@/models/mocks/sidebar";

export function AppSidebar({ translation, ...props }: SidebarProps) {
  const sidebarData = getSidebarMockData(translation);

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
