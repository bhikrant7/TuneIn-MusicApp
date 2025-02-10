import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AlbumListSkeleton from "@/components/skeletons/AlbumListSkeleton";
import { playAlbum, togglePlay } from "@/store/Slices/usePlayerSlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Pause, Play, Loader, HeartHandshake,PlayIcon } from "lucide-react";
import {
  fetchFavSongs,
  fetchRecentlyPlayedSongs,
  fetchStats,
  fetchTrendingSongs, // Newly imported action for trending songs
} from "@/store/Slices/useMusicSlice";

// Utility function to format song duration
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const useCustomInfoPage = () => {
  const { infoPage } = useParams(); // Get the page type from URL params
  const dispatch = useDispatch();

  if (!infoPage) return null; // If no page type, return early

  // Fetch data from Redux store
  const { RecentlyPlayedSongs, FavSongs, TrendingSongs } = useSelector(
    (state) => state.useMusic
  );
  const { currentSong, isPlaying } = useSelector((state) => state.usePlayer);

  // Determine the title, songs list, and header image based on infoPage value
  let title, Songs, imageUrl;
  if (infoPage === "recentlyplayed") {
    title = "Recently Played";
    Songs = RecentlyPlayedSongs;
    imageUrl = "/page/recently.jpg";
  } else if (infoPage === "trendingplays") {
    title = "Trending Songs";
    Songs = TrendingSongs;
    imageUrl = "/page/trending.jpg"; // Make sure this image exists in your public folder
  } else {
    title = "Favorites";
    Songs = FavSongs;
    imageUrl = "/page/fav.jpg";
  }

  // Fetch songs when the component mounts or when infoPage changes
  useEffect(() => {
    if (infoPage === "recentlyplayed") {
      dispatch(fetchRecentlyPlayedSongs());
    } else if (infoPage === "trendingplays") {
      dispatch(fetchTrendingSongs());
    } else {
      dispatch(fetchFavSongs());
      // dispatch(fetchStats())
    }
  }, [dispatch, infoPage]);

  // Handle playing the entire album/playlist
  const handlePlayAlbum = () => {
    if (!Songs || Songs.length === 0) return; // If no songs, return early

    // Check if the current album/playlist is already playing
    const isCurrentAlbumPlaying = Songs.some((song) => {
      // For recently played, song data is nested in song.songId; otherwise, use song directly.
      const songData = infoPage === "recentlyplayed" ? song.songId : song;
      return songData._id === currentSong?._id;
    });

    if (isCurrentAlbumPlaying) {
      dispatch(togglePlay()); // Toggle play/pause if the album is already playing
    } else {
      // Map songs to their actual song data and start playing from the beginning
      const songsToPlay = Songs.map((song) =>
        infoPage === "recentlyplayed" ? song.songId : song
      );
      dispatch(playAlbum([...songsToPlay, 0])); // Start playing from the first song
    }
  };

  // Handle playing a specific song
  const handlePlaySong = (index) => {
    if (!Songs) return; // If no songs, return early

    // Map songs to their actual song data and play the selected song
    const songsToPlay = Songs.map((song) =>
      infoPage === "recentlyplayed" ? song.songId : song
    );
    dispatch(playAlbum([...songsToPlay, index])); // Play the song at the specified index
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          {/* Background gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-red-400/20 via-swatch-6/40 to-swatch-2/30 pointer-events-none"
            aria-hidden="true"
          />

          {/* Main content */}
          <div className="relative z-10">
            {/* Header section with image and title */}
            <div className="flex p-8 gap-6 pb-8">
              <img
                src={imageUrl}
                alt={title}
                className="w-[300px] h-[300px] rounded-lg object-cover transition-transform duration-300 shadow-lg shadow-black/60 hover:scale-105 hover:shadow-xl hover:shadow-black/45"
              />
              <div className="flex flex-col justify-end">
                <h1 className="text-7xl font-bold my-4">{title}</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span>• {Songs.length} songs</span>
                </div>
              </div>
            </div>

            {/* Play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && Songs.some((song) => {
                  const songData =
                    infoPage === "recentlyplayed" ? song.songId : song;
                  return songData._id === currentSong?._id;
                }) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Table section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table header */}
              <div
                className={`grid ${
                  infoPage === "trendingplays"
                    ? "grid-cols-[16px_3.9fr_1fr_1fr_0.95fr]"
                    : "grid-cols-[16px_4fr_2.1fr_0.95fr]"
                } gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5`}
              >
                <div>#</div>
                <div>Title</div>
                {infoPage === "recentlyplayed" ? (<div>LastPlayed Date</div>) : (<div><HeartHandshake className="h-6 w-6" /></div>)}
                {infoPage === "trendingplays" && <div><PlayIcon /></div>}
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {Songs.map((song, index) => {
                    // For recently played, song data is nested; for trending or favorites, song is the song data.
                    const songData =
                      infoPage === "recentlyplayed" ? song.songId : song;
                    const isCurrentSong =
                      currentSong?._id === songData._id;

                    return (
                      <div
                        key={songData._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid ${
                          infoPage === "trendingplays"
                            ? "grid-cols-[16px_3.9fr_1fr_1fr_0.95fr]"
                            : "grid-cols-[16px_4.05fr_2fr_1fr]"
                        } gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        {/* Song number or play icon */}
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        {/* Song details */}
                        <div className="flex items-center gap-3">
                          <img
                            src={songData.imageUrl}
                            alt={songData.title}
                            className="size-10"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {songData.title}
                            </div>
                            <div>{songData.artist}</div>
                          </div>
                        </div>

                        {/* Last played date (only for recently played) */}
                        {infoPage === "recentlyplayed" ? (
                          <div className="flex items-center">
                            {new Date(song.playedAt).toLocaleDateString()}
                          </div>
                        ):(<div className="flex items-center">
                          {songData.favs || "__"}
                        </div>)}

                        {/* No of plays if trending page*/}
                        {infoPage ==="trendingplays" && <div className="flex items-center">
                          {songData?.weeklyPlays}
                        </div>}

                        {/* Song duration */}
                        <div className="flex items-center">
                          {formatDuration(songData?.duration)}
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

export default useCustomInfoPage;
