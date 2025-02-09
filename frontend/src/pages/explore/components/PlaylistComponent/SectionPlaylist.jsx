import { Button } from "@/components/ui/button";
import LinkAlbumWrapper from "./LinkAlbumWrapper";
import { useDispatch } from "react-redux";
import { setSearchAsk } from "@/store/Slices/useMusicSlice";
import SearchHandlerMap from "../SearchHandlerMap";
import { useState, useEffect } from "react";
import PlaylistInfo from "./PlaylistInfo";

const SectionPlaylist = ({
  albums, //it contains search result which has both album and song
  title,
  isLoading,
  isExpandCheck = false,
  isSearchResult = false,
  info,
}) => {
  const [albumState, setAlbumState] = useState(); //holds the current albums
  const [showAll, setShowAll] = useState(false); // Track "Show All" toggle

  useEffect(() => {
    if (albums.length > 0) {
      setAlbumState(albums.slice(0, 3));
    }
  }, [albums]);

  const dispatch = useDispatch();

  // Handle "Show All" or "Show 4" toggle
  const handleClick = () => {
    if (isSearchResult) {
      dispatch(setSearchAsk(false)); // Reset search state
    } else {
      if (isExpandCheck) {
        setShowAll(!showAll);
        setAlbumState(showAll ? albums.slice(0, 3) : albums);
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
          onClick={handleClick}
        >
          {isExpandCheck
            ? showAll
              ? "Show less"
              : "Show All"
            : isSearchResult
            ? "<< Go Back"
            : null}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Create playlist */}
        <PlaylistInfo />

        {!isSearchResult &&
          albumState &&
          albumState.length > 0 && //default case in props is false so it means generally albums will render simply
          albumState.map((album, index) => (
            <LinkAlbumWrapper album={album}>
              <div
                key={album._id}
                className="bg-gradient-to-tl from-pink-500/30 via-purple-700/40 to-swatch-5/50 p-4 rounded-md hover:bg-swatch-2/70 transition-all group cursor-pointer"
              >
                <div className="relative mb-4">
                  <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                    <img
                      src="/page/playlist.gif"
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-300 
                                group-hover:scale-105"
                    />
                  </div>
                </div>
                <h3 className="font-medium mb-2 truncate">{album.title}</h3>
              </div>
            </LinkAlbumWrapper>
          ))}
      </div>
    </div>
  );
};

export default SectionPlaylist;
