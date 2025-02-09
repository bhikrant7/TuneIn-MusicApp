import React from "react";

import { Library, ListMusic, CassetteTapeIcon, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";
import { useSelector } from "react-redux";
import { StatsGraph } from "./StatsGraphCard";
import {StatsPie} from "./StatsPieChart"

const StatsDashboard = () => {
  const { stats } = useSelector((state) => state.useMusic);
  // console.log(stats)

  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stats.totalSongs,
      bgColor: "bg-swatch-2/50",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stats.totalAlbums,
      bgColor: "bg-swatch-3/20",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: stats.totalArtists,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: CassetteTapeIcon,
      label: "Total Genres",
      value: stats.totalGenres,
      bgColor: "bg-swatch-3/20",
      iconColor: "text-swatch-5",
    },
  ];

  return (
    <div className="min-h-[400px] grid grid-row-1 md:grid-cols-3 justify-center items-center gap-4 ">
      <div className="grid grid-rows-4 gap-1 py-5">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
      <div className="select-none">
        <StatsPie />
        {/* <StatsGraph /> */}
       
      </div>
      <div className="">
        <StatsGraph data={"Weekly"} />
       
      </div>
    </div>
  );
};

export default StatsDashboard;
