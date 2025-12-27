import { ReactNode } from "react";

import { AppSidebar } from "@/components/container/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/container/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function DashboardLayout({
  children,
  params,
}: ParamsProps & { children: ReactNode }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <SidebarProvider>
      <AppSidebar translation={dict} />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
