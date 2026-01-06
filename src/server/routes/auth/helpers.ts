import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import type { AuthSession } from "@/models/interfaces/server/auth";

export type { AuthSession };

/**
 * Gets the current API session from Better Auth
 *
 * Extracts session from request headers and returns formatted session data.
 * Returns null if no session exists or user is missing.
 *
 * @returns Promise resolving to auth session or null if not authenticated
 */
export async function getApiSession(): Promise<AuthSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
  };
}

/**
 * Requires an authenticated API session
 *
 * Throws an error if no session exists.
 * Use this in API routes to ensure authentication.
 *
 * @returns Promise resolving to auth session (guaranteed to be non-null)
 * @throws Error with message "Unauthorized" if not authenticated
 */
export async function requireApiSession(): Promise<AuthSession> {
  const session = await getApiSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
