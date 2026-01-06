"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { NavSecondaryProps } from "@/models/interfaces/components/sidebar/nav-secondary";

/**
 * Secondary navigation component for sidebar
 *
 * Displays secondary navigation items (support, feedback, etc.).
 * Used for auxiliary navigation links in the sidebar.
 *
 * @param items - Array of secondary navigation items
 * @param className - Optional additional CSS classes
 * @param props - Additional navigation props
 */
export function NavSecondary({
  items,
  className,
  ...props
}: NavSecondaryProps) {
  return (
    <SidebarGroup className={cn(className)} {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

NavSecondary.displayName = "NavSecondary";
