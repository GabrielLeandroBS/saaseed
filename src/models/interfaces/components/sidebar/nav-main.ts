import { LucideIcon } from "lucide-react";

import { DictionaryType } from "@/lib/get/dictionaries";

export interface NavMainItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface NavMainProps extends React.HTMLAttributes<HTMLElement> {
  items: NavMainItemProps[];
  translation: DictionaryType;
}
