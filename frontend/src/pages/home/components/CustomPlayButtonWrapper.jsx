import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { playAlbum, setCurrentSong, togglePlay } from "@/store/Slices/usePlayerSlice";

const PlayButton = ({ song,index,songAsAlbum, children,colorBool=false }) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state) => state.usePlayer);

  const isCurrentSong = currentSong?._id === song._id; //check for the song id if running

  const handlePlay = () => {
    if (isCurrentSong) {
      dispatch(togglePlay()); //if running then toggle
    } else {
      dispatch(setCurrentSong(song)); //else set the song
      //also set the queue from the song where it is clicked
      dispatch(playAlbum([...songAsAlbum, index])) //GOOD JOB!!
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={`${
        isCurrentSong && isPlaying && !colorBool
          ? "animate-pulse bg-swatch-5/20 rounded-md"
          : "animate-none"
      }`}
      // style={{ animation: isCurrentSong && isPlaying ? 'pulse 3s infinite' : '' }}
      //   variant="ghost"
    >
      {children}
    </div>
  );
};

export default PlayButton;
