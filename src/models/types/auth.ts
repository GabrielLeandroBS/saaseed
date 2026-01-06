/**
 * Auth result types
 *
 * Result types for Supabase Auth user operations.
 */

import type { User } from "@supabase/supabase-js";

/** Result type for user sync operations */
export type UserSyncResult =
  | { user: User; isNew: boolean; error?: never }
  | { user?: never; isNew?: never; error: Error };

/** Result type for user existence check */
export type UserExistsResult =
  | { exists: boolean; error: null }
  | { exists: false; error: Error };

/** Result type for get user operations */
export type GetUserResult =
  | { user: User; error?: never }
  | { user?: never; error: Error };

/** Result type for delete user operations */
export type DeleteUserResult =
  | { success: true; error?: never }
  | { success?: never; error: Error };
