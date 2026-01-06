/**
 * Command dialog component interfaces
 *
 * Interfaces for command dialog wrapper component.
 */

/**
 * Suggestion item interface
 */
export interface CommandDialogSuggestion {
  label: string;
}

/**
 * Props for CommandDialogWrapper component
 */
export interface CommandDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
  emptyText: string;
  suggestionsHeading: string;
  suggestions: CommandDialogSuggestion[];
}

