"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ComboboxProps } from "@/models/interfaces/components/generic/combobox";

const Combobox = React.memo(function Combobox({
  options,
  value,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  onSelect,
  trigger,
  align = "start",
  side = "bottom",
  className,
  translations,
  ...props
}: ComboboxProps) {
  const finalPlaceholder = React.useMemo(
    () => placeholder || translations?.placeholder || "Select option...",
    [placeholder, translations?.placeholder],
  );
  const finalSearchPlaceholder = React.useMemo(
    () => searchPlaceholder || translations?.searchPlaceholder || "Search...",
    [searchPlaceholder, translations?.searchPlaceholder],
  );
  const finalEmptyMessage = React.useMemo(
    () => emptyMessage || translations?.emptyMessage || "No results found.",
    [emptyMessage, translations?.emptyMessage],
  );
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      onSelect?.(selectedValue);
      setOpen(false);
    },
    [onSelect],
  );

  const defaultTrigger = React.useMemo(
    () => (
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 justify-between min-w-32 ${className || ""}`}
        aria-label={
          selectedOption
            ? `Selected: ${selectedOption.label}`
            : `Select option: ${finalPlaceholder}`
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Text as="span" size="sm">
          {selectedOption?.label || finalPlaceholder}
        </Text>
        <ChevronDownIcon
          className="size-4 shrink-0 opacity-50"
          aria-hidden="true"
        />
      </Button>
    ),
    [selectedOption, finalPlaceholder, className, open],
  );

  return (
    <div className={cn(className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
        <PopoverContent
          className="p-0 w-72"
          align={align}
          side={side}
          sideOffset={4}
          avoidCollisions={false}
          role="listbox"
        >
          <Command>
            <CommandInput
              placeholder={finalSearchPlaceholder}
              aria-label="Search options"
            />
            <CommandList>
              <CommandEmpty>{finalEmptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, option.description || ""]}
                    onSelect={handleSelect}
                    className="flex items-start px-4 py-2"
                    aria-selected={value === option.value}
                  >
                    <div className="space-y-1">
                      <Text as="p" size="sm" weight="medium">
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text as="p" size="sm" color="muted">
                          {option.description}
                        </Text>
                      )}
                    </div>
                    {value === option.value && (
                      <CheckIcon
                        className="text-primary ml-auto flex size-4"
                        aria-hidden="true"
                      />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});

Combobox.displayName = "Combobox";

export { Combobox };
