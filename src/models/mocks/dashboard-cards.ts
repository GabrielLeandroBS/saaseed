import type { RevenueCardData } from "@/models/interfaces/components/generic/card/revenue";
import type { ExerciseMinutesCardData } from "@/models/interfaces/components/generic/card/exercise-minutes";

export const getRevenueCardMock = (): RevenueCardData => ({
  value: "$15,231.89",
  change: 20.1,
  changeLabel: "from last month",
  chartData: [
    { month: "Jan", value: 12000 },
    { month: "Feb", value: 13500 },
    { month: "Mar", value: 12500 },
    { month: "Apr", value: 14500 },
    { month: "May", value: 15231 },
    { month: "Jun", value: 14800 },
  ],
});

export const getExerciseMinutesCardMock = (): ExerciseMinutesCardData => ({
  description: "Your exercise minutes are ahead of where you normally are.",
  currentData: [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 50 },
    { month: "Apr", value: 55 },
    { month: "May", value: 60 },
    { month: "Jun", value: 58 },
  ],
  previousData: [
    { month: "Jan", value: 55 },
    { month: "Feb", value: 40 },
    { month: "Mar", value: 35 },
    { month: "Apr", value: 30 },
    { month: "May", value: 45 },
    { month: "Jun", value: 50 },
  ],
  // onExport will be handled in the Client Component
});
