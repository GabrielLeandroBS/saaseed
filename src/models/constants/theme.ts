/**
 * Theme configuration constants
 *
 * Constants for theme-related UI components.
 */

import type { LucideIcon } from "lucide-react";
import { Moon, Sun } from "lucide-react";

/**
 * Theme icon mapping
 */
export const THEME_ICONS: Record<string, LucideIcon> = {
  light: Moon,
  dark: Sun,
} as const;

