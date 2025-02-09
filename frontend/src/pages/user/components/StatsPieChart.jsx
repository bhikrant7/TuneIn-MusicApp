"use client"

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

export function StatsPie() {
  // Get the trending songs from Redux
  const trendingSongs = useSelector((state) => state.useMusic.TrendingSongs);

  if (!trendingSongs || trendingSongs.length === 0) {
    return <div>Loading trending songs...</div>;
  }

  // Sort trending songs in descending order by playCount
  const sortedSongs = [...trendingSongs].sort((a, b) => b.playCount - a.playCount);

  // slicing out the top 5 songs and group the rest
  const topFive = sortedSongs.slice(0, 5);
  const restTrending = sortedSongs.slice(5);
  const restPlays = restTrending.reduce((acc, song) => acc + (song.playCount || 0), 0);


  const colorPalette = [
    "hsl(var(--chart-1))", // Top song
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  
  const restColor = "hsl(var(--destructive))";

  //one entry per top 5 song and one for the remaining songs
  const chartData = topFive.map((song, index) => ({
    name: song.title,
    plays: song.playCount || 0,
    fill: colorPalette[index],
  }));

  if (restTrending.length > 0) {
    chartData.push({
      name: "Rest Trending",
      plays: restPlays,
      fill: restColor,
    });
  }

  // Calculate overall total plays for trending songs (for the center label)
  const totalTrendingPlays = sortedSongs.reduce(
    (acc, song) => acc + (song.playCount || 0),
    0
  );

  return (
    <Card className="flex flex-col bg-swatch-1/20">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trending Songs Over Users</CardTitle>
        <CardDescription>Top Artist: {trendingSongs[0].artist}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
       
        <div className="mx-auto" style={{ width: '100%', height: 341 }}>
        <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="plays"
          nameKey="name"
          innerRadius={80}
          outerRadius={140}
          strokeWidth={1}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 20}
                      className="fill-foreground text-xl font-bold"
                    >
                      {totalTrendingPlays.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0)}
                      className="fill-muted-foreground text-sm"
                    >
                      Total Plays
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 30}
                      className="fill-foreground text-xl font-bold"
                    >
                      {trendingSongs[0].title}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Displaying top 5 songs and the rest trending combined
        </div>
      </CardFooter>
    </Card>
  );
}
