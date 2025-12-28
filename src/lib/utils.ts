import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function avatarFallback(name: string) {
  return name.trim()?.[0]?.toUpperCase() ?? null;
}
