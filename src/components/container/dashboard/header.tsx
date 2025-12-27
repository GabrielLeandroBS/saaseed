"use client";

import * as React from "react";
import { Command, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { UserMenu } from "@/components/container/user/menu";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { COMMAND_SHORTCUT_KEY } from "@/models/interfaces/components/dashboard/header";

export function DashboardHeader() {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === COMMAND_SHORTCUT_KEY && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleSearchClick = () => {
    setOpen(true);
  };

  return (
    <>
      <header className="sticky top-2 z-50 w-full border-b border-border bg-transparent backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-4!" />

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          ) : (
            <div className="relative w-full md:max-w-40 lg:max-w-80">
              <div className="relative">
                <SearchIcon
                  className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                  aria-hidden="true"
                />

                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search..."
                  className={cn("w-full pl-10 pr-4")}
                  onFocus={handleInputFocus}
                  onClick={handleInputFocus}
                />
                <Kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono sm:flex dark:bg-neutral-700">
                  <Command className="size-3" aria-hidden="true" />
                  <Text as="span" size="xs" weight="medium">
                    {COMMAND_SHORTCUT_KEY}
                  </Text>
                </Kbd>
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-4!" />
            <UserMenu />
          </div>
        </div>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
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
    </>
  );
}
