import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

/**
 * Supabase client for client-side operations (Storage, Realtime, etc.)
 * Uses anon key and respects RLS (Row Level Security) policies
 * Use this for operations that should respect user permissions
 */
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Supabase Admin client for server-side administrative operations
 * Uses service role key to bypass RLS and manage auth.users directly
 *
 * ⚠️ IMPORTANT: Only use this on the server-side for:
 * - User management (create, update, delete users)
 * - Bypassing RLS when necessary
 * - Administrative operations that require elevated permissions
 *
 * Never expose this client to the client-side!
 */
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
