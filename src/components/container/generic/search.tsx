"use client";

import * as React from "react";
import { Command, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/text";

import { cn } from "@/lib/utils";
import { type SearchProps } from "@/models/interfaces/components/generic/search";
import { COMMAND_SHORTCUT_KEY } from "@/models/interfaces/components/dashboard/header";

function Search({
  translations,
  shortcutKey = COMMAND_SHORTCUT_KEY,
  onOpenChange,
  className,
  children,
}: SearchProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange],
  );

  const handleOpen = React.useCallback(() => {
    handleOpenChange(true);
  }, [handleOpenChange]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === shortcutKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcutKey, open, handleOpenChange]);

  return (
    <>
      <div className={className}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpen}
          aria-label={translations.ariaLabel}
          className="block md:hidden"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>

        <div className="relative w-full md:max-w-40 lg:max-w-80 hidden md:block">
          <div className="relative">
            <SearchIcon
              className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />

            <Input
              type="search"
              placeholder={translations.placeholder}
              className={cn("w-full pl-10 pr-4")}
              onFocus={handleOpen}
              onClick={handleOpen}
            />
            <Kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono sm:flex dark:bg-neutral-700">
              <Command className="size-3" aria-hidden="true" />
              <Text as="span" size="xs" weight="medium">
                {shortcutKey}
              </Text>
            </Kbd>
          </div>
        </div>
      </div>

      {typeof children === "function"
        ? children({ open, onOpenChange: handleOpenChange })
        : children}
    </>
  );
}

export { Search };
