/**
 * Auth service types
 *
 * Internal result types for auth service operations.
 */

import type { User } from "@supabase/supabase-js";

/**
 * Result type for user operations
 */
export type UserResult =
  | { user: User; error?: never }
  | { user?: never; error: Error };

