import React, { useEffect } from "react";
import Topbar from "./components/Topbar";
import {
  fetchAlbums,
  setSearchAsk,
  fetchGenreAlbums,
} from "@/store/Slices/useMusicSlice";
import { useSelector, useDispatch } from "react-redux";
import SectionGrid from "./components/SectionGrid";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchAllPlaylist } from "@/store/Slices/usePlaylistSlice";
import SectionPlaylist from "./components/PlaylistComponent/SectionPlaylist";
import { useAuth } from "@/context/authContext";
import { useSearchParams } from "react-router-dom";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {currentUser} = useAuth();
//  const currentUser = false;
//dispatch on load
  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchGenreAlbums());
    dispatch(fetchAllPlaylist()) ///here
    // console.log(genreAlbums);
  }, [dispatch]);


  const {
    albums,
    isLoading,
    searchFoundBool,
    searchResults,
    searchAskedBool,
    genreAlbums,
    error,
  } = useSelector((state) => state.useMusic); //fetch the albums


  const {playlists,isLoadingForPlayL} = useSelector((state)=>state.usePlaylist) //fetch playlists of user

  //to get from chat msg
  //from chat
    const [searchParams] = useSearchParams();
    const content = searchParams.get("content"); // Get the 'content' parameter
    let trigger = false;
    if(content) {
      trigger = true;
    }
  

  return (
    <main className="h-full rounded-md flex flex-col bg-gradient-to-t from-swatch-6/50 via-red-600/30 to-swatch-1/5 select-none">
      <Topbar content={content} trigger={trigger} />
      <ScrollArea className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-24">
          {!searchAskedBool && (
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              Explore the Albums
            </h1>
          )}
          <div className="space-y-8">
            {searchAskedBool ? (
              searchFoundBool && searchResults.length > 0 ? (
                <SectionGrid
                  title="Search Results 🔍"
                  isSearchResult={true}
                  albums={searchResults}
                  isLoading={isLoading}
                />
              ) : (
                <>
                  <p className="text-red-500 font-bold">
                    No results found. Try different keywords. Or{" "}
                    <Button
                      variant={"ghost"}
                      className="text-2xl italic underline"
                      onClick={() => {
                        if(content) {
                          navigate("/chat")
                          setTimeout(() => {
                        dispatch(setSearchAsk(false));
                        }, 1000)
                          
                          }
                        else{
                          dispatch(setSearchAsk(false));
                        navigate("/explore");
                        }

                        
                      }}
                    >
                      To exit click
                    </Button>
                  </p>
                </>
              )
            ) : (
              <>
                {currentUser && (<SectionPlaylist
                  title="My Playlists"
                  isExpandCheck={true}
                  albums={playlists}
                  isLoading={isLoadingForPlayL}
                />)}
                <SectionGrid
                  title="Featured Albums"
                  isExpandCheck={true}
                  albums={albums.filter(
                    (album) =>
                      !genreAlbums.some(
                        (genrealbum) => genrealbum._id === album._id
                      )
                  )}
                  isLoading={isLoading}
                />
                <SectionGrid
                  title="Moods 📀 Genres"
                  isExpandCheck={true}
                  albums={genreAlbums}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default ExplorePage;
