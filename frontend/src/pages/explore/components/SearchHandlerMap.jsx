import React from "react";
import PlayButton from "./PlayButton";
import LinkAlbumWrapper from "./LinkAlbumWrapper";


const SearchHandlerMap = ({
  searchAlbums,
  searchSongs,
  isExpandCheck = false,
  isSearchResult = false,
}) => {
  return (
    <>
      {isSearchResult &&
        searchSongs.length > 0 &&
        //FIRST SONGS DISPLAY
        //searchsongs has only songs that matches search so it can be played
        searchSongs.map((song, index) => (
          <div
            key={song._id}
            className="bg-gradient-to-tl from-pink-500/30 via-purple-700/40 to-swatch-5/50 p-4 rounded-md hover:bg-swatch-2/70 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                      group-hover:scale-105"
                />
              </div>
              <PlayButton songAsAlbum={searchSongs} index={index} song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      {isSearchResult &&
        searchAlbums.length > 0 &&
        //ALBUMS DISPLAY
        //searchAlbums has only albums that matches search and are grouped by album

        searchAlbums.map((album, index) => (
          <LinkAlbumWrapper album={album}>
          <div
            key={album._id}
            className="bg-gradient-to-tl from-pink-500/30 via-purple-700/40 to-swatch-5/50 p-4 rounded-md hover:bg-swatch-2/70 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                      group-hover:scale-105"
                />
              </div>
            </div>
            <h3 className="font-medium mb-2 truncate">{album.title}<span className="text-purple-400 font-extrabold"> - Album</span></h3>
            <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
          </div>
          </LinkAlbumWrapper>
        ))}
    </>
  );
};

export default SearchHandlerMap;
