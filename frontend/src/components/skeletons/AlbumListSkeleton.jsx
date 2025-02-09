import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";

const AlbumListSkeleton = () => {
  return (
  

    <div className="h-full ">
      <div className="relative z-10 min-h-full flex flex-col ">
        <div className="flex p-8 gap-6 pb-8 inset-0 bg-gradient-to-b from-swatch-5/30 via-swatch-3/15
					 to-swatch-2/5">
          <Skeleton className="w-[300px] h-[300px] rounded-xl"  />

          <div className="flex flex-col justify-end">
            <p className="text-sm font-medium"></p>
            <Skeleton className="h-6 w-[400px]" />
            <div className="flex items-center py-2">
              <Skeleton className="h-4 w-[250px]" />
            </div>
          </div>
        </div>

        {/* play button */}
        <div className="px-6 pb-4 flex items-center gap-2">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-green-500/50 transition-all animate-pulse"
          ></Button>
        </div>
        <div className="space-y-4 pl-5">
          <Skeleton className="h-10 w-11/12" />
          <Skeleton className="h-10 w-11/12" />
          <Skeleton className="h-10 w-11/12" />
          <Skeleton className="h-10 w-11/12" />
        
        </div>
      </div>
    </div>
  );
};

export default AlbumListSkeleton;

