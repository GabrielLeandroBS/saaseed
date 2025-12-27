import { LucideIcon } from "lucide-react";

export interface NavSecondaryItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface NavSecondaryProps {
  items: NavSecondaryItemProps[];
  className?: string;
}
