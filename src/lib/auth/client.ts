"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { env } from "@/env";

/**
 * Better Auth client for client-side authentication
 *
 * Configured with magic link plugin for passwordless authentication.
 * Base URL is set from NEXT_PUBLIC_API_URL environment variable.
 */
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [magicLinkClient()],
});

/**
 * Exported authentication methods and hooks
 *
 * - signIn: Sign in user (email/password or magic link)
 * - signUp: Register new user
 * - signOut: Sign out current user
 * - useSession: React hook to get current session
 */
export const { signIn, signUp, signOut, useSession } = authClient;
