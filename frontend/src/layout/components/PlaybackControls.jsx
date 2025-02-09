import React from "react";
import { Slider } from "@/components/ui/slider";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import {
  postFavSong,
  fetchFavSongs,
  fetchAlbums,
  updateFavCount,
} from "@/store/Slices/useMusicSlice";
import { toast } from "react-hot-toast";
import {
  togglePlay,
  playNext,
  playPrevious,
  setPlayFalse,
  setLoopForAlbum,
  setLoopForSong,
  resetLoopForAlbum,
  resetLoopForSong,
  setisFav,
} from "@/store/Slices/usePlayerSlice";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LucideRepeat1,
  Laptop2,
  HeartIcon,
  Pause,
  Play,
  Repeat,
  VolumeX,
  SkipBack,
  SkipForward,
  Volume1,
  FilePlus,
  Plus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { fetchAllPlaylist, postSongToPlaylist } from "@/store/Slices/usePlaylistSlice";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, isLoopAlbum, isLoopSong } = useSelector(
    (state) => state.usePlayer
  );

  const { currentUser } = useAuth();

  //local states
  const [volume, setVolume] = useState(100); //75% default
  const [muteBool, setMuteBool] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchAllPlaylist());
  }, [dispatch]);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      dispatch(setPlayFalse()); //set the isPlaying false
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  //forLooping
  // Inside your PlaybackControls component
  useEffect(() => {
    let audio = audioRef.current;
    if (!audio) return;

    audio.loop = isLoopSong; // Directly set the loop property based on state

    if (isLoopSong) {
      const handleEnded = () => {
        audio.currentTime = 0;
        audio.play();
      };
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [isLoopSong]);

  //volume bar
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  //handle mute
  const handleMute = () => {
    const varMute = !muteBool; //negate
    setMuteBool(varMute);

    if (varMute) {
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0 / 100;
      }
    } else {
      setVolume(75);
      if (audioRef.current) {
        audioRef.current.volume = 75 / 100;
      }
    }
  };

  // Update your loop handlers
  const handleLoopAlbum = () => {
    if (isLoopAlbum) {
      dispatch(resetLoopForAlbum());
    } else {
      dispatch(setLoopForAlbum());
      //dispatch(resetLoopForSong()); // Ensure mutual exclusivity
    }
  };

  const handleLoopSong = () => {
    if (isLoopSong) {
      dispatch(resetLoopForSong());
    } else {
      dispatch(setLoopForSong());
      //dispatch(resetLoopForAlbum()); // Ensure mutual exclusivity
    }
  };

  //For Setting up link to album
  const { albums } = useSelector((state) => state.useMusic);
  const { isFav } = useSelector((state) => state.usePlayer);

  //Update the favorite song
  const handleFavoriteSong = (currentSong) => {
    if (currentUser) {
      dispatch(postFavSong(currentSong?._id))
        .then((response) => {
          //console.log("Received response in handler:", response.payload);

          if (response.payload?.isAdded) {
            // console.log("data posted and the action is added")
            dispatch(setisFav(true));
            //Update fav stats
            dispatch(updateFavCount(currentSong?._id)); //update the fav count
          } else if (!response.payload?.isAdded) {
            // console.log("data posted and the action is deleted")
            dispatch(setisFav(false));
          }
          //console.log("The isFav state is ",isFav)
          dispatch(fetchFavSongs());
        })
        .catch((err) => console.log("Error in posting favorite song", err));
    } else {
      //alert("Please login to add songs to your favorites");
      // Handle errors and reset state

      toast.error("Please login to add song to Favorites :)", {
        duration: 1500, // How long the toast stays (in ms)
        position: "bottom-right", // Position of the toast
        style: {
          background: "#341949",
          color: "#FF0000",
        },
      }); // Error toast
    }
  };

  //for playlist
  const { playlists, isLoadingForPlayL } = useSelector(
    (state) => state.usePlaylist
  );

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <footer className="h-20 sm:h-24 bg-gradient-to-t from-swatch-5/20 to-swatch-2/20 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                  <span>{" | "}</span>

                  {(() => {
                    const album = albums.find(
                      (a) => a._id === currentSong.albumId
                    );
                    return album ? (
                      <Link
                        to={`/albums/${album._id}`}
                        className="hover:text-white hover:underline transition-colors"
                      >
                        {album.title}
                      </Link>
                    ) : null;
                  })()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Album Loop Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex hover:text-white ${
                currentSong && isLoopAlbum
                  ? "text-white scale-105"
                  : "text-zinc-400"
              }`}
              onClick={handleLoopAlbum}
            >
              <Repeat className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={() => {
                dispatch(playPrevious());
              }}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
              onClick={() => {
                dispatch(togglePlay());
              }}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={() => {
                dispatch(playNext());
              }}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex hover:text-white ${
                currentSong && isLoopSong
                  ? "text-white scale-x-105"
                  : "text-zinc-400"
              }`}
              onClick={() => {
                handleLoopSong();
              }}
            >
              <LucideRepeat1 className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
            onClick={() => handleFavoriteSong(currentSong)}
          >
            {isFav ? (
              <HeartIcon className="h-4 w-4 fill-white" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
          </Button>



          {/* Add SOng to playlist */}
          {/* Handling adding to playlist */}


          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="min-w-max p-4 space-y-2 bg-zinc-800 border-zinc-700">
              <Label className="text-sm font-medium text-white">
                PlayList:
              </Label>
              <Select
                onValueChange={(value) => setSelectedPlaylist(value)} // ✅ Capture selection
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {playlists.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full mt-2 bg-swatch-5/70 hover:bg-swatch-5"
                onClick={() => {
                  if (!selectedPlaylist) {
                    alert("Please select a playlist!");
                    return;
                  }
                  else{
                    dispatch(
                    postSongToPlaylist({
                      playlistId: selectedPlaylist,
                      songId: currentSong._id,
                    })
                  );
                  }
                  
                }}
              >
                Add to Playlist
              </Button>
            </PopoverContent>
          </Popover>



          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={() => handleMute()}
            >
              {volume === 0 ? <VolumeX /> : <Volume1 className="h-4 w-4" />}
            </Button>

            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;
