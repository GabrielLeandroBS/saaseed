"use server";

import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

/**
 * Server action to get the current user session
 *
 * ⚠️ SERVER-ONLY: This function can only be used in Server Components and Server Actions.
 * For client components, use `useSession` from `@/lib/auth/client`.
 *
 * Uses React cache to deduplicate requests within the same render.
 *
 * @returns Session object or null if not authenticated
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

/**
 * Server action that requires authentication
 *
 * ⚠️ SERVER-ONLY: This function can only be used in Server Components and Server Actions.
 * Redirects to sign-in page if user is not authenticated.
 *
 * @returns Session object (guaranteed to be non-null)
 * @throws Redirects to /sign-in if not authenticated
 */
export const requireAuth = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
});

/**
 * Server action to sign out the current user
 *
 * ⚠️ SERVER-ONLY: This function can only be used in Server Components and Server Actions.
 * For client components, use `signOut` from `@/lib/auth/client`.
 *
 * Clears the authentication session using Better Auth API.
 * Removes session cookies and invalidates the current session.
 *
 * @returns Promise that resolves when sign out is complete
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
