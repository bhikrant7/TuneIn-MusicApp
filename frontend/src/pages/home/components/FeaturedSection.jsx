import FeaturedGridSkeleton from "@/components/skeletons/FeatureGridSkeleton";
import React from "react";
import { useSelector } from "react-redux";
import PlayButton from "./PlayButton";

const FeaturedSection = ({songs}) => {
  const { isLoading, error } = useSelector(
    (state) => state.useMusic
  );

  if (isLoading) return <FeaturedGridSkeleton />;

  //if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {songs.map((song,index) => (
        <div
          key={song._id}
          className="flex items-center bg-gradient-to-tl from-pink-500/30 via-purple-700/40 to-swatch-5/50 rounded-md overflow-hidden
     hover:bg-purple-500/20 transition-colors group cursor-pointer relative"
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
          />
          <div className="flex-1 p-4">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
          <PlayButton songAsAlbum={songs} index={index} song={song} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;
