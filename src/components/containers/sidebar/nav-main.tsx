"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";

import { cn } from "@/lib/utils";

import { NavMainProps } from "@/models/interfaces/components/sidebar/nav-main";

/**
 * Main navigation component for sidebar
 *
 * Displays primary navigation items with icons and active states.
 * Supports i18n translations for navigation labels.
 *
 * @param items - Array of navigation items to display
 * @param translation - Translation dictionary for navigation labels
 * @param className - Optional additional CSS classes
 * @param props - Additional navigation props
 */
export function NavMain({
  items,
  translation,
  className,
  ...props
}: NavMainProps) {
  return (
    <SidebarGroup className={cn(className)} {...props}>
      <SidebarGroupLabel>{translation.sidebar.navMain.title}</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <Text as="span">{item.title}</Text>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <Text as="span" className="sr-only">
                        Toggle
                      </Text>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <Text as="span">{subItem.title}</Text>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

NavMain.displayName = "NavMain";
