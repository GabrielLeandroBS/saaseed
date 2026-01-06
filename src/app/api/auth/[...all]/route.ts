import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handlers
 *
 * Handles all authentication routes (sign-in, sign-up, magic link, OAuth, etc.).
 * Converts Better Auth instance to Next.js route handlers.
 */
export const { POST, GET } = toNextJsHandler(auth);
