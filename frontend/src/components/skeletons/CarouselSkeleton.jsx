import { Skeleton } from "@/components/ui/skeleton";

const CarouselSkeleton = () => {
  return (
    <div className="h-full ">
      <div className="relative z-10 min-h-full flex flex-col ">
        <div
          className="flex p-8 gap-6 pb-8 inset-0 bg-gradient-to-b from-swatch-5/30 via-swatch-3/15
					 to-swatch-2/5 rounded-md"
        >
          <Skeleton className="w-full h-[300px] rounded-xl animate-pulse" />
        </div>

        {/* play button */}
        <div className="px-6 pb-4 flex items-center gap-2"></div>
      </div>
    </div>
  );
};
export default CarouselSkeleton;
