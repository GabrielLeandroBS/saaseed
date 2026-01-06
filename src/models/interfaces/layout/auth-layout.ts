/**
 * Auth layout interfaces
 *
 * Interfaces for authentication layout components.
 */

/**
 * Props for AuthLayout component
 */
export interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}
