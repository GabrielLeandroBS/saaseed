import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 *
 * Combines clsx and tailwind-merge to handle conditional classes and resolve conflicts.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates avatar fallback initial from name
 *
 * Extracts the first letter of the name and converts to uppercase.
 *
 * @param name - User name string
 * @returns First letter uppercase or null if name is empty
 */
export function avatarFallback(name: string) {
  return name.trim()?.[0]?.toUpperCase() ?? null;
}
