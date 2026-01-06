/**
 * Server auth interfaces
 *
 * Interfaces for server-side authentication operations.
 */

/**
 * Authentication session interface
 */
export interface AuthSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  };
}
