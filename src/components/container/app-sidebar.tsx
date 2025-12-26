"use client";

import { Rocket } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/container/nav-main";
import { NavSecondary } from "@/components/container/nav-secondary";
import { NavUser } from "@/components/container/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SidebarProps } from "@/models/interfaces/sidebar";

import { getSidebarMockData } from "@/models/mocks/sidebar";

export function AppSidebar({ translation, ...props }: SidebarProps) {
  const sidebarData = getSidebarMockData(translation);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Rocket className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Template</span>

                  <span className="truncate text-xs">
                    {translation.sidebar.shortDescription}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
