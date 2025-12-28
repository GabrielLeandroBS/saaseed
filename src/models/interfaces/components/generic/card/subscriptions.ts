export interface SubscriptionsCardData {
  value: number;
  change: number;
  changeLabel: string;
  chartData: Array<{
    month: string;
    value: number;
  }>;
}

import { DictionaryType } from "@/lib/get/dictionaries";

export interface SubscriptionsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SubscriptionsCardData;
  translation?: DictionaryType;
  variant?: "default" | "compact";
}
