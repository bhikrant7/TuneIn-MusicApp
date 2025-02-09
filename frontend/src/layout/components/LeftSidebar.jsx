import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  HomeIcon,
  MessageCircle,
  Music2Icon,
  HeartIcon,
  FileMusicIcon,
  AudioLines,
  RefreshCcw,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSongs,
  fetchAlbums,
  setRandomDisplaySongs,
} from "@/store/Slices/useMusicSlice";


import CustomPlayButtonWrapper from "@/pages/home/components/CustomPlayButtonWrapper";
import { setQueue } from "@/store/Slices/usePlayerSlice";

const LeftSidebar = () => {
  const { currentUser } = useAuth(); //to showcase the name of the user in sidebar (Used Context API)

  const [date, setDate] = useState(); //to showcase the greeting message based on time of day.

 

  //Fetching from useMusicSlice
  const { songs, albums, isLoading, displaySongs, error } = useSelector(
    (state) => state.useMusic
  );
  //check admin
  const {isAdmin} = useSelector(state=>state.useMyAuth)

  const dispatch = useDispatch();


  //function to showcase date
  const dateFunction = () => {
    const dt = new Date();
    const hours = dt.getHours();
    const greeting =
      hours < 12
        ? "Good Morning"
        : hours < 18
        ? "Good Afternoon"
        : "Good Evening";
    setDate(greeting);
  };
  //as son as the page loads

  

   
 //dispatch the asyncthunk 
  useEffect(() => {
    dateFunction();
    dispatch(fetchAlbums());
    dispatch(fetchSongs())
  }, [dispatch]);

  // .then((response) => {
  //   if (response.payload?.length > 0) {
  //     dispatch(setQueue(response.payload)); // Set queue only after fetching
  //   }
  // });

  //to get the autoplayfunctioning
    //first set the queue
    // useEffect(() => {
    //   if (displaySongs.length > 0) {
    //     dispatch(setQueue(displaySongs)); // Only set queue if there are songs
    //   }
    // }, [displaySongs, dispatch]);
    
  //more songs to refresh
  const handleLoadMore = () => {
    dispatch(setRandomDisplaySongs());
    dispatch(setQueue(displaySongs));
  };

 
  return (
    <div className="h-full flex flex-col gap-2 select-none">
      {/* Profile Card */}
      <div
        className="flex flex-col items-start justify-start space-x-2 bg-swatch-2/35 rounded-lg
      gap-4 p-6 pr-auto rin"
      >
        <img
          src={
            currentUser && currentUser.photoURL
              ? currentUser.photoURL
              : "https://i.pinimg.com/originals/47/30/38/473038bf60343d88ccb4188c0df1c544.jpg"
          }
          alt="Profile Picture"
          className="w-20 rounded-3xl object-cover lg:min-w-[110px] min-w-[75px]  h-auto"
        />

        <span className="text-xl text-left font-medium text-white gap-4">
          {date}
          <p className="text-left text-base text-swatch-5">
            {currentUser && currentUser.displayName
              ? currentUser.displayName.split(" ")[0]
              : "Guest"}
          </p>
          <span className="italic text-green-400 text-sm">{isAdmin && "(Admin)"}</span>
        </span>
      </div>

      {/* Navigation menu */}
      {/* Home Button */}
      <div className="rounded-lg bg-swatch-2/35 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-white/5",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Explore Button */}
          <Link
            to={"/explore"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-white/5",
              })
            )}
          >
            <Music2Icon className="mr-2 size-5" />
            <span className="hidden md:inline">Explore</span>
          </Link>

          {/* Message Button */}
          {/* <SignedIn> */}
          <Link
            to={"/chat"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-white/5",
              })
            )}
          >
            <MessageCircle className="mr-2 size-5" />
            <span className="hidden md:inline">Messages</span>
          </Link>

          {/* Offline Button */}
          <Link
            to={"/user-songs-info/favorites"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-white/5",
              })
            )}
          >
            <HeartIcon  className="mr-2 size-5" />
            <span className="hidden md:inline">Favorites</span>
          </Link>
          {/* </SignedIn> */}
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-swatch-2/35 p-4 flex flex-col overflow-hidden">
        <div className="flex md:items-center justify-start md:justify-between  mb-4 px-2 text-white flex-col gap-2 md:flex-row">
          <span className="hidden md:inline text-base font-bold">
            Play Songs
          </span>
          <span className="md:inline text-base font-bold hover:font-extrabold hover:text-lg">
            <RefreshCcw
              className=" text-swatch-5 transition-transform duration-100 hover:animate-pulse active:animate-spin"
              onClick={handleLoadMore}
            />
          </span>
        </div>

        {/* Scroll area */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-2 pb-4">
            {" "}
            {/* Added padding-bottom for smooth scrolling */}
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              displaySongs.map((song,index) => (
                <CustomPlayButtonWrapper song={song} index={index} songAsAlbum={displaySongs}>
                  <div
                  key={song._id}
                  className="p-2 hover:bg-white/5 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={song.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-swatch-5 truncate inline-flex gap-1">
                      {(() => {
                        const album = albums.find(
                          (a) => a._id === song.albumId
                        );
                        return album ? (
                          <>
                            <Link
                              to={`/albums/${album._id}`}
                              className="hover:text-white hover:underline transition-colors"
                            >
                              {album.title}
                            </Link>{" "}
                            <AudioLines className="text-white/60 size-5 font-bold" />
                            {song.artist}
                          </>
                        ) : (<>
                          Unknown Album <AudioLines className="text-white/60 size-5 font-bold" /> {song.artist}
                          </>);
                      })()}
                      
                      
                    </p>
                  </div>
                </div>
                </CustomPlayButtonWrapper>
                
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
