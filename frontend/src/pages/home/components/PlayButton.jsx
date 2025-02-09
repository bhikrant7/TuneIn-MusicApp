import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong, togglePlay,playAlbum } from "@/store/Slices/usePlayerSlice";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const PlayButton = ({ song, songAsAlbum, index }) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state) => state.usePlayer);

  const isCurrentSong = currentSong?._id === song._id; //check for the song id if running

  const handlePlay = () => {
    if (isCurrentSong) {
      dispatch(togglePlay()); //if running then toggle
    } else {
      dispatch(setCurrentSong(song)); //else set the song
      //also set the queue from the song where it is clicked
      dispatch(playAlbum([...songAsAlbum, index])); //GOOD JOB!!
    }
  };

  return (
    <Button
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-swatch-5 hover:bg-pink-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayButton;
