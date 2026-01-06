import { AppSidebar } from "@/components/containers/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/containers/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireAuth } from "@/server/actions";

import { LocaleType } from "@/models/types/locale";

import { DashboardLayoutProps } from "@/models/interfaces/components/dashboard/layout";

/**
 * Dashboard layout component
 *
 * Provides sidebar, header, and main content area for dashboard pages.
 * Requires authentication and loads translations for the specified locale.
 *
 * @param children - Dashboard page content
 * @param params - Route parameters containing language
 * @returns Promise resolving to dashboard layout JSX
 */
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { lang } = await params;
  const locale = lang as LocaleType;

  await requireAuth();

  const dict = await getDictionary(locale);

  return (
    <SidebarProvider>
      <AppSidebar translation={dict} />
      <SidebarInset>
        <DashboardHeader translation={dict} />
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
