import React from "react";
import StatsDashboard from "./components/commonStats/StatsDashboard";
import Header from "./components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsInfo from "./components/song/SongsInfo";
import AlbumInfo from "./components/album/AlbumInfo";
import { AlbumIcon, Music } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlbums,
  fetchGenreAlbums,
  fetchSongs,
  fetchStats,
  fetchTrendingSongs,
} from "@/store/Slices/useMusicSlice";
import { fetchUsers } from "@/store/Slices/useChatSlice";
import UserStats from "./components/UserStats";

const AdminPage = () => {
  const { isAdmin, isLoading } = useSelector((state) => state.useMyAuth);

  const dispatch = useDispatch();

  if (!isAdmin && !isLoading) return <div>UnAuthorized</div>;

  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchAlbums());
    // dispatch(fetchGenreAlbums())
    dispatch(fetchStats());
    dispatch(fetchUsers());
    dispatch(fetchTrendingSongs());
  }, [dispatch, fetchSongs, fetchAlbums, fetchStats, fetchUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-swatch-1 via bg-swatch-2/20 to-swatch-3/40 text-zinc-100 p-8 overflow-auto custom-scrollbar">
      <Header />
      <StatsDashboard />

      <Tabs defaultValue="song" className="space-y-6 mt-3 ">
        <TabsList className="p-1 rounded-md bg-zinc-800 ">
          <TabsTrigger value="song" className="data-[state=active]:bg-zinc-700">
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="album"
            className="data-[state=active]:bg-zinc-700"
          >
            <AlbumIcon className="mr-2 size-4" />
            Albums
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-zinc-700"
          >
            <AlbumIcon className="mr-2 size-4" />
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="song">
          <SongsInfo />
          {/* Song */}
        </TabsContent>
        <TabsContent value="album">
          <AlbumInfo />
          {/* Album */}
        </TabsContent>
        <TabsContent value="stats">
          <UserStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
