import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playNext, togglePlay, setisFav } from "@/store/Slices/usePlayerSlice";
import {
  postRecentlyPlayedSong,
  fetchRecentlyPlayedSongs,
  fetchFavSongs,
  updatePlayCount,
} from "@/store/Slices/useMusicSlice";
import { useAuth } from "@/context/authContext";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state) => state.usePlayer); //Based on currentSong and isPlaying state of redux
  const { FavSongs } = useSelector((state) => state.useMusic);
  const { currentUser } = useAuth();
  //const {RecentlyPlayedSongs} = useSelector(state => state.useMusic);

  const audioRef = useRef(null); //ref to html audio element
  const prevSongRef = useRef(null); //string or null ||will store the prev song audiourl to compare current song new or not

  //to handle play or pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    //use useEffect only to post in backend
    if (!currentUser || !currentSong) return;
    // console.log("Checking the current song to post",currentSong?._id);
    dispatch(postRecentlyPlayedSong(currentSong._id)).then(() => {
      dispatch(fetchRecentlyPlayedSongs());
    });

    //update play counts
    dispatch(updatePlayCount(currentSong?._id))
    
    // Fetch favorite songs and update the favorite status
    dispatch(fetchFavSongs()).then((action) => {
      const updatedFavSongs = action.payload; // Assuming fetchFavSongs returns data in action.payload
      if (updatedFavSongs?.find((s) => s._id === currentSong._id)) {
        dispatch(setisFav(true));
      } else {
        dispatch(setisFav(false));
      }
    });

    // console.log("Dispatched post!")
  }, [dispatch, currentSong]);

  //to handle starting the next song when the current song ends
  //custom EventListener on event "ended"
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      dispatch(playNext());
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded); //cleanup
  }, [dispatch]);

  //handle when song changed
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      // reset the playback position
      audio.currentTime = 0;

      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
