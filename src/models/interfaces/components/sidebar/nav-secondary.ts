import { LucideIcon } from "lucide-react";

export interface NavSecondaryItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface NavSecondaryProps extends React.HTMLAttributes<HTMLElement> {
  items: NavSecondaryItemProps[];
}
