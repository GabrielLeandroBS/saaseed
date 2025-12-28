import { ReactNode } from "react";

export interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}
