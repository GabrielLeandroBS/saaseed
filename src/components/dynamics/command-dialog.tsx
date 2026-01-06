"use client";

import dynamic from "next/dynamic";

const CommandDialog = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandDialog,
    })),
  { ssr: false }
);

const CommandInput = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandInput,
    })),
  { ssr: false }
);

const CommandList = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandList,
    })),
  { ssr: false }
);

const CommandEmpty = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandEmpty,
    })),
  { ssr: false }
);

const CommandGroup = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandGroup,
    })),
  { ssr: false }
);

const CommandItem = dynamic(
  () =>
    import("@/components/ui/command").then((mod) => ({
      default: mod.CommandItem,
    })),
  { ssr: false }
);

import type { CommandDialogWrapperProps } from "@/models/interfaces/components/dynamics/command-dialog";

/**
 * Wrapper component for CommandDialog with dynamic imports
 *
 * Reduces the initial bundle size by only loading cmdk when the dialog is opened.
 * Provides command palette functionality with search and suggestions.
 *
 * @param open - Whether the dialog is open
 * @param onOpenChange - Callback when open state changes
 * @param placeholder - Placeholder text for search input
 * @param emptyText - Text to show when no results found
 * @param suggestionsHeading - Heading for suggestions section
 * @param suggestions - Array of suggestion items to display
 */
export function CommandDialogWrapper({
  open,
  onOpenChange,
  placeholder,
  emptyText,
  suggestionsHeading,
  suggestions,
}: CommandDialogWrapperProps) {
  if (!open) {
    return null;
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup heading={suggestionsHeading}>
          {suggestions.map((suggestion, index) => (
            <CommandItem key={index}>{suggestion.label}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
