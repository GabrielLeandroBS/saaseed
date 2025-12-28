export interface ExerciseMinutesCardData {
  description: string;
  currentData: Array<{
    month: string;
    value: number;
  }>;
  previousData: Array<{
    month: string;
    value: number;
  }>;
  onExport?: () => void;
}

export interface ExerciseMinutesCardProps {
  data: ExerciseMinutesCardData;
  className?: string;
}
