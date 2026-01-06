/**
 * Auth service interfaces
 *
 * Interfaces for authentication service operations.
 */

/**
 * Parameters for syncing user to external services
 */
export interface SyncUserParams {
  userId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  supabaseUserId?: string;
}
