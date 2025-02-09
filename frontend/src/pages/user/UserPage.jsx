import React from "react";
import StatsDashboard from "./components/StatsDashboard";
import Header from "./components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AlbumIcon, Music } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums, fetchSongs, fetchStats, fetchTrendingSongs, fetchUserMonthlyStats } from "@/store/Slices/useMusicSlice";
import { fetchUsers } from "@/store/Slices/useChatSlice";
import UserStats from "./components/UserStats";
import { useAuth } from "@/context/authContext";


const UserPage = () => {
    //const {isLoading} = useSelector(state => state.useMusic)
    const {currentUser} = useAuth();
    console.log(currentUser)

    const dispatch = useDispatch();

    if(!currentUser) return(<div>UnAuthorized</div>)

    useEffect(()=>{
        dispatch(fetchSongs());
        dispatch(fetchAlbums());
        dispatch(fetchStats());
        dispatch(fetchUsers());
        dispatch(fetchTrendingSongs());
        dispatch(fetchUserMonthlyStats())
        
    },[dispatch,fetchSongs,fetchAlbums,fetchStats,fetchUsers])


  return (
    <div className="min-h-screen bg-gradient-to-b from-swatch-1 via bg-swatch-2/20 to-swatch-3/40 text-zinc-100 p-8">
      <Header />
      <StatsDashboard />
      
      <Tabs defaultValue="stats" className="space-y-6 mt-3 ">
        <TabsList className='p-1 rounded-md bg-zinc-800 '>
          
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-zinc-700"
          >
            <AlbumIcon className="mr-2 size-4" />
            Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <UserStats />
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default UserPage;
