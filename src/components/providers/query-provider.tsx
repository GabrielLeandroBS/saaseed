"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * React Query client instance with default options
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Query provider component for React Query
 *
 * Wraps children with QueryClientProvider to enable React Query hooks.
 * Configures default query options (1 minute stale time, no window focus refetch).
 *
 * @param children - React children to wrap with QueryClientProvider
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
