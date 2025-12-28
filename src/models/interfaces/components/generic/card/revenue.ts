export interface RevenueCardData {
  value: string;
  change: number;
  changeLabel: string;
  chartData: Array<{
    month: string;
    value: number;
  }>;
}

export interface RevenueCardProps {
  data: RevenueCardData;
  className?: string;
}
