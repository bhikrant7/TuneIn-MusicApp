import Topbar from "@/components/Topbar";
import React, { useEffect ,useMemo} from "react";
import {
  fetchFeaturedSongs,
  fetchTrendingSongs,
  fetchMadeForYouSongs,
  fetchRecentlyPlayedSongs,
} from "@/store/Slices/useMusicSlice";
import { useSelector, useDispatch } from "react-redux";
import FeaturedSection from "./components/FeaturedSection";
import TrendingCarousel from "./components/TrendingCarousel";
import SectionGrid from "./components/SectionGrid";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAuth } from "@/context/authContext";

const HomePage = () => {
  const { currentUser } = useAuth();

  const {
    songs,
    TrendingSongs,
    MadeForYouSongs,
    FeaturedSongs,
    displaySongs,
    RecentlyPlayedSongs,
    isLoading,
    isLoadingForMutexReload,
  } = useSelector((state) => state.useMusic);

  const dispatch = useDispatch();
  
  // 🔹 Combined Fetch Calls in One useEffect
  useEffect(() => {
    dispatch(fetchFeaturedSongs());
    dispatch(fetchTrendingSongs());
    dispatch(fetchRecentlyPlayedSongs());
    dispatch(fetchMadeForYouSongs());
  }, [dispatch]);
//I DID FETCHING IN THE Audioplayer jsx whenever post recentlyplayed at that time i fetch it
  // useEffect(() => {
  //   dispatch(fetchRecentlyPlayedSongs());
  // }, [dispatch,RecentlyPlayedSongs]);


  return (
    <main className="h-full rounded-md flex flex-col bg-gradient-to-b from-swatch-2/5 via-swatch-7/30 select-none overflow-hidden">
      <Topbar />
      <ScrollArea className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-24">
          <TrendingCarousel
            songs={displaySongs}
            songsFallback={songs}
            isLoading={isLoading}
            isLoadingCustom={isLoadingForMutexReload}
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Featured Songs
          </h1>
          <FeaturedSection songs={FeaturedSongs} />

          <div className="space-y-8">
            {currentUser && RecentlyPlayedSongs?.length > 0 && (
              <SectionGrid
                isAlbumExpandCheck={true}
                info={"recentlyplayed"}
                title="Recently Played"
                songs={RecentlyPlayedSongs.map((item) => item.songId)} //as because song description inside songId not directly inside song or 'item'
                isLoading={isLoading}
              />
            )}
            {currentUser && MadeForYouSongs?.length > 0 && (
              <SectionGrid
                title="Made For You"
                songs={MadeForYouSongs}
                isLoading={isLoading}
                isRefreshSectionCheck={true}
              />
            )}

            <SectionGrid
              title="Trending"
              songs={TrendingSongs}
              isLoading={isLoading}
              isAlbumExpandCheck={true}
              info={"trendingplays"}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
