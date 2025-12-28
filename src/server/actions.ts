"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export const requireAuth = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
});

export async function signInEmail(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return result;
}

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

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
