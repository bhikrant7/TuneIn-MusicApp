"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { fetchUserMonthlyStats } from "@/store/Slices/useMusicSlice";

const chartConfig = {
  plays: { label: "Daily Plays", color: "hsl(var(--chart-1))" },
};

const UserStats = () => {
  const dispatch = useDispatch();
  const { userStats, isStatLoading, error } = useSelector(
    (state) => state.useMusic
  );

  

  // useEffect(() => {
  //   dispatch(fetchUserMonthlyStats()); // Fetch stats for a specific user
  // }, [dispatch]);

  if (isStatLoading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading chart: {error}</div>;
  if (!userStats) return <div>No data available</div>;

  // Extract data for the specific user
  const { dailyPlays = [], topSong, topArtist } = userStats;
  console.log("USER STATS:", userStats);
  // Prepare chart data
  const chartData = dailyPlays.map((day) => {
    if (!day._id) {
      console.warn("Missing date in dailyPlays entry:", day);
      return { date: "N/A", plays: day.plays ?? 0 };
    }
  
    return {
      date: new Date(day._id).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      plays: day.plays ?? 0,
    };
  });

  //fallback
  const imageUrl = topSong?.imageUrl || "/fallback.jpg";
  return (
    <Card className="bg-swatch-1/20 p-4 flex max-h-[500px] box-content">
      {/* Chart Section */}
      <div className="w-2/3">
        <CardHeader>
          <CardTitle>Monthly Play Statistics</CardTitle>
          <CardDescription>Plays per day for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="max-h-80">
            <ChartStyle config={chartConfig} />
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                scale="point"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
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
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </div>

      {/* Sidebar Section */}
      <div
        className="w-1/3 flex flex-col justify-center items-center rounded-lg p-4"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity:0.8,
        }}
      ><div className="md:aspect-square bg-swatch-3/80 p-4 rounded-xl">
        <h3 className="text-2xl font-bold bg-gradient-to-b from-swatch-2/70 via-swatch-1/80 to-swatch-2/70 p-3 rounded-md mb-2">User Highlights</h3>
        <div className="mb-2 text-center bg-swatch-4 p-2 rounded-md">
          <p className="text-sm text-muted-foreground">Top Song</p>
          <p className="font-medium">{topSong?.title || "No data"}</p>
        </div>
        <div className="text-center bg-swatch-4 p-2 rounded-md">
          <p className="text-sm text-muted-foreground">Top Artist</p>
          <p className="font-medium">{topArtist?.name || "No data"}</p>
        </div>
      </div>
        
      </div>
    </Card>
  );
};

export default UserStats;
