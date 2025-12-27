"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { UserMenu } from "@/components/container/user/menu";
import { Search } from "@/components/container/generic/search";

import {
  COMMAND_SHORTCUT_KEY,
  type DashboardHeaderProps,
} from "@/models/interfaces/components/dashboard/header";

export function DashboardHeader({ translation }: DashboardHeaderProps) {
  return (
    <>
      <header className="sticky top-2 z-50 w-full border-b border-border bg-transparent backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-4!" />

          <Search
            translations={translation.generic.search}
            shortcutKey={COMMAND_SHORTCUT_KEY}
          >
            {({ open, onOpenChange }) => (
              <CommandDialog open={open} onOpenChange={onOpenChange}>
                <CommandInput
                  placeholder={translation.generic.search.dialogPlaceholder}
                />
                <CommandList>
                  <CommandEmpty>
                    {translation.generic.search.noResults}
                  </CommandEmpty>
                  <CommandGroup
                    heading={translation.generic.search.suggestions}
                  >
                    <CommandItem>
                      <Text as="span">Calendar</Text>
                    </CommandItem>
                    <CommandItem>
                      <Text as="span">Search Emoji</Text>
                    </CommandItem>
                    <CommandItem>
                      <Text as="span">Calculator</Text>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            )}
          </Search>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-4!" />
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
