"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Get the current session on the server
 * Use this in server components or server actions
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 * Use this in server components or server actions that require auth
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

/**
 * Sign in with email and password
 */
export async function signInEmail(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return result;
}

/**
 * Sign up with email and password
 */
export async function signUpEmail(
  email: string,
  password: string,
  name?: string,
) {
  const body: { email: string; password: string; name?: string } = {
    email,
    password,
  };

  if (name) {
    body.name = name;
  }

  const result = await auth.api.signUpEmail({
    body: body as { email: string; password: string; name: string },
  });

  return result;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
