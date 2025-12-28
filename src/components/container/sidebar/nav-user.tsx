"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import { SignOut } from "@/components/features/sign-out";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/client";
import type { NavUserProps } from "@/models/interfaces/components/sidebar/nav-user";

export function NavUser({ className, ...props }: NavUserProps) {
  const { isMobile } = useSidebar();

  const { data: session } = useSession();

  return (
    <SidebarMenu className={cn(className)} {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? undefined}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <Text as="span" size="sm" weight="medium" className="truncate">
                  {session?.user?.name}
                </Text>
                <Text as="span" size="xs" className="truncate">
                  {session?.user?.email}
                </Text>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.image ?? undefined}
                    alt={session?.user?.name ?? undefined}
                  />
                  <AvatarFallback className="rounded-lg">
                    {session?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1">
                  <Text
                    as="span"
                    size="sm"
                    weight="medium"
                    leading="tight"
                    className="truncate"
                  >
                    {session?.user?.name}
                  </Text>
                  <Text
                    as="span"
                    size="xs"
                    leading="tight"
                    className="truncate"
                  >
                    {session?.user?.email}
                  </Text>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

NavUser.displayName = "NavUser";
