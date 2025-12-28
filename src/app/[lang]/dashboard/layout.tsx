import { AppSidebar } from "@/components/container/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/container/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { getDictionary } from "@/lib/get/dictionaries";
import { requireAuth } from "@/server/actions";

import { LocaleType } from "@/models/types/locale";

import { DashboardLayoutProps } from "@/models/interfaces/components/dashboard/layout";

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
