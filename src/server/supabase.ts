import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

/**
 * Supabase client for server-side usage
 *
 * Use this client for:
 * - Server-side Storage operations
 * - Server-side Realtime subscriptions
 * - Database queries
 * - Other Supabase features (not authentication - use Better Auth instead)
 *
 * Note: For authentication, use Better Auth (src/lib/auth/auth.ts)
 *
 * @see https://supabase.com/docs/reference/javascript/introduction
 */
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
