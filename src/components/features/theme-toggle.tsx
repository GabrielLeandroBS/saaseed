"use client";

import * as React from "react";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { THEME_ICONS } from "@/models/constants/theme";

/**
 * Theme toggle button component
 *
 * Allows users to switch between light and dark themes.
 * Uses next-themes for theme management and prevents hydration mismatch.
 *
 * @returns Button component for theme switching
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = React.useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const Icon =
    mounted && theme && theme in THEME_ICONS ? THEME_ICONS[theme] : Sun;

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={handleToggle}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

ThemeToggle.displayName = "ThemeToggle";
