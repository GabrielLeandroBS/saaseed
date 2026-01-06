"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider component wrapper
 *
 * Wraps next-themes ThemeProvider for light/dark theme support.
 * Provides theme context to all children components.
 *
 * @param children - React children to wrap with theme provider
 * @param props - Additional theme provider props (attribute, defaultTheme, etc.)
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
