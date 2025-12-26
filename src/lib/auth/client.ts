"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance for React
 *
 * @see https://better-auth.com/docs/getting-started/create-client-instance
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Export commonly used methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
