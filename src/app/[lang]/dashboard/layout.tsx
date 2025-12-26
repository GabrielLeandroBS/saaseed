import { ReactNode } from "react";

import { AppSidebar } from "@/components/container/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/params";

export default async function DashboardLayout({
  children,
  params,
}: ParamsProps & { children: ReactNode }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <SidebarProvider className="gap-4">
      <AppSidebar translation={dict} />

      <main className="flex flex-col w-full lg:flex-row gap-4 py-4 max-lg:container">
        <div className="flex justify-end ">
          <SidebarTrigger className="items-center lg:items-start justify-end lg:justify-center" />
        </div>

        <section className="flex-1 items-start lg:container">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
}
