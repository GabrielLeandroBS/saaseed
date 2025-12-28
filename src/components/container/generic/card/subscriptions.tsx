"use client";

import * as React from "react";
import { BarChart, Bar, CartesianGrid, LabelList } from "recharts";
import { cva } from "class-variance-authority";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Text } from "@/components/ui/text";

import { cn } from "@/lib/utils";

import { type SubscriptionsCardProps } from "@/models/interfaces/components/generic/card/subscriptions";

const chartConfig = {
  subscriptions: {
    label: "Subscriptions",
    color: "var(--color-ring)",
  },
} satisfies ChartConfig;

// Variant system for SubscriptionsCard
const subscriptionsCardVariants = cva("transition-all duration-200", {
  variants: {
    variant: {
      default: "",
      compact: "[&_[data-slot=card-content]]:p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Helper function to format numeric values with locale-aware formatting
const formatValue = (val: string | number) => {
  if (typeof val === "number") {
    return new Intl.NumberFormat("en-US").format(val);
  }
  return val;
};

export function SubscriptionsCard({
  data,
  className,
  translation,
  variant,
  ...props
}: SubscriptionsCardProps) {
  return (
    <Card
      className={cn(
        subscriptionsCardVariants({ variant }),
        "w-full",
        className,
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>
          <Text as="h2" size="base" weight="medium">
            {translation?.dashboard?.subscriptions?.title || "Subscriptions"}
          </Text>
        </CardTitle>
        <CardDescription>
          <Text as="p" size="sm" color="muted">
            {translation?.dashboard?.subscriptions?.description ||
              "Track your subscription growth and trends."}
          </Text>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          <Text as="div" size="3xl" weight="medium" className="leading-6">
            {data.change > 0 ? "+" : ""}
            {formatValue(data.value)}
          </Text>

          <Text as="p" size="xs" color="muted" className="mt-1.5">
            <Text as="span" size="xs" className="text-green-500">
              {data.change > 0 ? "+" : ""}
              {data.change}%
            </Text>{" "}
            {data.changeLabel}
          </Text>
        </div>

        <ChartContainer
          config={chartConfig}
          className="mt-6 lg:h-36 h-28 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data.chartData}
            margin={{
              left: 8,
              right: 8,
              top: 20,
              bottom: 8,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="value" fill="var(--color-ring)" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                className="fill-foreground text-xs whitespace-nowrap"
                offset={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

SubscriptionsCard.displayName = "SubscriptionsCard";
