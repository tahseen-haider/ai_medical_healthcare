"use client";

import * as React from "react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive bar chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  user:{
    label:"Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Chart({
  chartData,
}: {
  chartData: {
    date: string;
    number: number;
  }[];
}) {
  const [timeRange, setTimeRange] = React.useState("30d");
  console.log(chartData)

  function fillMissingDates(data: any[], days: number) {
    const today = new Date();
    const filled: any[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const existing = data.find((d) => d.date === dateStr);
      filled.push(existing || { date: dateStr, desktop: 0, mobile: 0 });
    }

    return filled;
  }

  let daysToSubtract = 90;
  if (timeRange === "30d") daysToSubtract = 30;
  else if (timeRange === "7d") daysToSubtract = 7;

  const filteredData = chartData
    .filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date();
      referenceDate.setHours(0, 0, 0, 0);

      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filledData = fillMissingDates(filteredData, daysToSubtract);

  return (
    <div className="p-2 flex flex-col justify-between h-full overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="font-bold">New Coming Users:</h3>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart data={filledData} barCategoryGap={1}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={{ fill: "transparent" }}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Bar
            dataKey="number"
            fill="var(--color-user)"
            stackId="a"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
