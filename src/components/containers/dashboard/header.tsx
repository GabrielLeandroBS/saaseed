"use client";

import * as React from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { UserMenu } from "@/components/containers/user/menu";
import { Search } from "@/components/containers/generic/search";
import { CommandDialogWrapper } from "@/components/dynamics/command-dialog";

import { cn } from "@/lib/utils";

import { type DashboardHeaderProps } from "@/models/interfaces/components/dashboard/header";
import { COMMAND_SHORTCUT_KEY } from "@/models/constants/dashboard";

/**
 * Dashboard header component
 *
 * Displays sidebar trigger, search, theme toggle, and user menu.
 * Uses sticky positioning with backdrop blur for modern UI.
 *
 * @param translation - Translation dictionary for i18n
 * @param className - Optional additional CSS classes
 * @param props - Additional header props
 */
export function DashboardHeader({
  translation,
  className,
  ...props
}: DashboardHeaderProps) {
  const searchTranslations = React.useMemo(
    () => translation.generic.search,
    [translation.generic.search]
  );

  return (
    <header
      className={cn(
        "sticky top-2 z-50 w-full border-b border-border bg-transparent backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger />

        <Separator orientation="vertical" className="h-4!" />

        <Search
          translations={searchTranslations}
          shortcutKey={COMMAND_SHORTCUT_KEY}
        >
          {({ open, onOpenChange }) => (
            <CommandDialogWrapper
              open={open}
              onOpenChange={onOpenChange}
              placeholder={translation.generic.search.dialogPlaceholder}
              emptyText={translation.generic.search.noResults}
              suggestionsHeading={translation.generic.search.suggestions}
              suggestions={[
                { label: "Calendar" },
                { label: "Search Emoji" },
                { label: "Calculator" },
              ]}
            />
          )}
        </Search>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-4!" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

DashboardHeader.displayName = "DashboardHeader";
