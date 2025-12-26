import { LifeBuoy, Search, Send } from "lucide-react";

import { DictionaryType } from "@/lib/get/dictionaries";

import { SidebarMockData } from "@/models/interfaces/sidebar";

export const getSidebarMockData = (
  translation: DictionaryType,
): SidebarMockData => ({
  navMain: [
    {
      title: translation.sidebar.navMain.search,
      url: "/dashboard/search",
      icon: Search,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: translation.sidebar.navSecondary.support,
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: translation.sidebar.navSecondary.feedback,
      url: "#",
      icon: Send,
    },
  ],
});
