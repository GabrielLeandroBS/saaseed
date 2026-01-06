/**
 * Dashboard layout interfaces
 *
 * Interfaces for dashboard layout component props.
 */

import { ReactNode } from "react";

/**
 * Props for DashboardLayout component
 */
export interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}
