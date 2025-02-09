import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { postFavSong, fetchFavSongs ,updateFavCount} from "@/store/Slices/useMusicSlice";
import { setisFav } from "@/store/Slices/usePlayerSlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";
import CustomPlayButtonWrapper from "./CustomPlayButtonWrapper";
import { useAuth } from "@/context/authContext";
import { useDispatch, useSelector } from "react-redux";

const TrendingCarousel = ({
  songs,
  songsFallback,
  isLoading,
  isLoadingCustom,
}) => {
  //default songs: made for you
  const currentUser = useAuth();
  const dispatch = useDispatch();

 
  const { FavSongs } = useSelector((state) => state.useMusic);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  // ✅ Shuffle only once per song update (performance optimization)
  const shuffleSongs = (songList, count) =>
    [...songList].sort(() => Math.random() - 0.5).slice(0, count);

  const carouselDisSong = React.useMemo(() => {
    if (currentUser) {
      return shuffleSongs(songs, 12);
    } else {
      return shuffleSongs(songsFallback, 12);
    }
  }, [songs, songsFallback, currentUser]);

  //fetch fav songs
  React.useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavSongs());
    }
  }, [currentUser]);

  //fav song handler
  //Update the favorite song
  const handleFavoriteSong = (song) => {
    if (currentUser) {
      dispatch(postFavSong(song?._id))
        .then((response) => {
          // console.log("Received response in handler:", response.payload);
         

          if (response.payload?.isAdded) {
            console.log("data posted and the action is added");
             dispatch(updateFavCount({ songId: song?._id}));
          } else if (!response.payload?.isAdded) {
            console.log("data posted and the action is deleted");
          }

          dispatch(fetchFavSongs());
        })
        .catch((err) => console.log("Error in posting favorite song", err));
    } else {
      alert("Please login to add songs to your favorites");
    }
  };

  return (
    <div className="w-full flex justify-center pb-2 mb-2">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
          align: "center",
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        loop={true}
      >
        {/* <CarouselPrevious /> */}
        <CarouselContent>
          {" "}
          {carouselDisSong.map((song, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="p-1 sm:p-2 lg:p-4 ">
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <div className="relative w-full object-cover rounded-lg overflow-hidden bg-gradient-to-b from-red-300/65 to-swatch-6/65 shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                      <div className="p-4 flex flex-row-reverse gap-2 justify-around place-items-start">
                        <img
                          src={song?.imageUrl}
                          alt={song?.title}
                          className="max-h-[350px] rounded-lg object-cover shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out hidden md:h-[350px] my-auto lg:inline"
                        />
                        <div className="flex flex-col justify-center items-stretch gap-3 overflow-visible text-zinc-100 ml-2 ">
                          <h1 className="text-7xl font-bold mt-8">
                            {`${song?.artist}'s`}
                          </h1>
                          <h1 className="text-4xl font-medium mx-4 my-5">
                            {`${song?.title}`}
                          </h1>
                          <div className="pl-3 pt-3 flex items-center gap-5 lg:gap-8">
                            <Button className="min-h-[50px] min-w-[150px] rounded-3xl font-medium hover:scale-105">
                              <CustomPlayButtonWrapper
                                songAsAlbum={carouselDisSong}
                                index={index}
                                colorBool={true}
                                song={song}
                              >
                                Listen Now
                              </CustomPlayButtonWrapper>
                            </Button>
                            <Button
                              onClick={() => [handleFavoriteSong(song)]}
                              className="rounded-3xl w-[40px] h-[40px] text-black font-extrabold hover:scale-110"
                            >
                              {FavSongs.some(  //return true or false directly
                                (favSong) => favSong._id === song._id
                              ) ? (
                                <HeartIcon className="fill-red-600" />
                              ) : (
                                <HeartIcon className="fill-white"/>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <CarouselNext /> */}
      </Carousel>
    </div>
  );
};

export default TrendingCarousel;
