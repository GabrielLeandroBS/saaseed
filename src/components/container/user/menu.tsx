"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { SignOut } from "@/components/features/sign-out";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/client";
import type { UserMenuProps } from "@/models/interfaces/components/user/menu";

export function UserMenu({ className, ...props }: UserMenuProps) {
  const { data: session } = useSession();

  return (
    <div className={cn(className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? undefined}
              />

              <AvatarFallback>
                {session?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? undefined}
                />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) ?? "U"}
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
                  {session?.user?.name ?? "User"}
                </Text>
                <Text
                  as="span"
                  size="xs"
                  color="muted"
                  leading="tight"
                  className="truncate"
                >
                  {session?.user?.email ?? ""}
                </Text>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

UserMenu.displayName = "UserMenu";
