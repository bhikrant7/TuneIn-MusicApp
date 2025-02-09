import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMadeForYouSongs } from "@/store/Slices/useMusicSlice";


const SectionGrid = ({
  songs,
  title,
  isLoading,
  isAlbumExpandCheck = false,
  isRefreshSectionCheck = false,
  info,
}) => {
  //dispatch when queried for refresh
  const dispatch = useDispatch();





  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
        >
          {isAlbumExpandCheck ? (
            <Link to={`/user-songs-info/${info}`}>Show all</Link>
          ) : isRefreshSectionCheck ? (
            <Button variant={'link'} className="text-zinc-400 hover:text-white" onClick={() => dispatch(fetchMadeForYouSongs())}>Refresh</Button>
          ) : (
            "Show all"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.slice(0, 4).map((song, index) => (
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
              <PlayButton songAsAlbum={songs} index={index} song={song} /> 
              {/* Sending all song as album and the currensong */}
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
