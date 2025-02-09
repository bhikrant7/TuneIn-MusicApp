import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Clock, Pause, Play, Loader, Trash2, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import AlbumListSkeleton from "@/components/skeletons/AlbumListSkeleton";
import { playAlbum, togglePlay } from "@/store/Slices/usePlayerSlice";
import {
  deletePlaylist,
  fetchPlaylistById,
  postSongToPlaylist,
} from "@/store/Slices/usePlaylistSlice";

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayListPage = () => {
  const { playlistId } = useParams(); //useParams is used in react-router to get the params from url
  //the name albumId is due to how it is defined in app.jsx (:albumId)
  // console.log("Album Id:", albumId);

  //Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //usePlayer Slice
  const { currentSong, isPlaying } = useSelector((state) => state.usePlayer);

  //usePlaylist Slice
  const { currentPlaylist, isLoading } = useSelector(
    (state) => state.usePlaylist
  );

  useEffect(() => {
    playlistId && dispatch(fetchPlaylistById(playlistId));
  }, [dispatch, playlistId]);

  if (isLoading)
    return (
      <AlbumListSkeleton /> //skeleton
    );

  //Play Song Logic
  const handlePlayAlbum = () => {
    // Check if currentPlaylist exists and has songs
    if (
      !currentPlaylist ||
      !currentPlaylist.songs ||
      currentPlaylist.songs.length === 0
    ) {
      console.error("No album or songs found!");
      return;
    }

    const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
      (song) => song._id === currentSong?._id
    );
    // console.log("tyoe of",typeof(currentPlaylist.songs))
    if (isCurrentPlaylistPlaying) dispatch(togglePlay());
    else {
      // start playing the album from the beginning
      let startIndex = 0;
      dispatch(playAlbum([...currentPlaylist?.songs, startIndex])); //arrayle convert kori dilu jaa baal khon
    }
  };

  const handlePlaySong = (index) => {
    if (!currentPlaylist) return;
    let disIndex = index;
    dispatch(playAlbum([...currentPlaylist?.songs, disIndex]));
  };

  //UI LOGIC
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-bl from-blue-800 via-blue-400/50 to-swatch-2/30 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-8 gap-6 pb-8">
              <img
                src="/page/playlist.gif"
                alt={currentPlaylist?.title}
                className="w-[300px] h-[300px] rounded-lg object-cover transition-transform duration-300 shadow-lg shadow-black/60 hover:scale-105 hover:shadow-xl hover:shadow-black/45"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">My Playlist</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentPlaylist?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentPlaylist?.artist}
                  </span>
                  <span>• {currentPlaylist?.songs.length} songs</span>
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex justify-between items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentPlaylist?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              <div>
                <Button
                  onClick={() => {
                    dispatch(deletePlaylist(currentPlaylist._id));
                    setTimeout(() => {
                      navigate("/explore");
                    }, 1500);
                  }}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-red-400 hover:bg-red-500 
                hover:scale-105 transition-all"
                >
                  <Trash2Icon className="h-10 w-10 text-black" />
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Duration</div>
                <div>
                  {/* <Clock className="h-4 w-4" /> */}
                  Action
                </div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentPlaylist?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)} //Play SOng logic handler
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => {
                              dispatch(
                                postSongToPlaylist({
                                  playlistId: currentPlaylist._id,
                                  songId: song._id,
                                })
                              );
                              setTimeout(() => {
                                navigate(0);
                              }, 1500);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          {/* {song.createdAt.split("T")[0]} */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default PlayListPage;
