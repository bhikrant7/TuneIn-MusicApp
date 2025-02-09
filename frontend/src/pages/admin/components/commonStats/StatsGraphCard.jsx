"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
} from "@/components/ui/chart";

const chartConfig = {
  plays: { label: "Daily Plays", color: "hsl(var(--chart-1))" },
  uniqueUsers: { label: "Unique Users", color: "hsl(var(--chart-2))" }, // ✅ Change label
};

export function StatsGraph({ data }) {
  const { stats, isStatLoading, error } = useSelector((state) => state.useMusic);

  if (isStatLoading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading chart: {error}</div>;

  // Ensure daily plays data exists
  const dailyPlays = stats.dailyPlays || [];
  const dailyUniqueUsers = stats.dailyUniqueUsers || [];

  // Prepare chart data
  const chartData = dailyPlays.map((day) => {
    // Find matching unique users data for the same date
    const uniqueData = dailyUniqueUsers.find(u => u.date === day.date);
    return {
      date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
      plays: day.plays ?? 0,
      uniqueUsers: uniqueData ? uniqueData.uniqueUsers : 0,
    };
  });
  

  return (
    <Card className="bg-swatch-1/20">
      <CardHeader>
        <CardTitle>{data}</CardTitle>
        <CardDescription>Daily song plays vs unique users</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ChartStyle config={chartConfig} />
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={{ stroke: "gray", strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {/* Daily Plays Area */}
            <Area
              dataKey="plays"
              type="monotone"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
            />
            {/* Unique Users Area (constant line) */}
            <Area
              dataKey="uniqueUsers" // ✅ Change from totalUsers to uniqueUsers
              type="monotone"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.2}
              stroke="hsl(var(--chart-2))"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between text-sm text-muted-foreground">
          <div>Total Plays: {stats.totalPlays ?? 0}</div>
          <div>Weekly Plays: {stats.weeklyPlays ?? 0}</div>
          <div>Total Users: {stats.totalUsers ?? 0}</div> {/* ✅ Updated field */}
        </div>
      </CardFooter>
    </Card>
  );
}
