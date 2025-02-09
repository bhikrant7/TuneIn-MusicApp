import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsers } from "@/store/Slices/useChatSlice";
import { useAuth } from "@/context/authContext";
import { HeadphonesIcon, Music, Users,StarIcon } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendsActivity = () => {
  const dispatch = useDispatch();

  //const isPlaying = false; // will handle later

  //only perform if user loggin in
  //to do this logic
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) dispatch(fetchUsers());
  }, [dispatch, currentUser]);

  const { users,adminUser, isLoading, error,onlineUsers,userActivities } = useSelector((state) => state.useChat);
  //console.log("userActivities",userActivities)
  

  // console.log(`Users are: ${users}`);
  // console.log(`Users are: ${typeof users}`);

  return (
    <div className="h-full bg-swatch-2/35 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-swatch-5/30">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What your friends listening to</h2>
        </div>
      </div>
      {!currentUser && <LoginPrompt />}

      {currentUser && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {users.map((user) => {
              const activity = userActivities[user.uid];
              const isPlaying = activity && activity !== "Idle";

              //console.log("userActivities per User",currentUser.uid)
              return (
                <div
                  key={user._id}
                  className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="size-10 border border-zinc-800">
                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                        <AvatarFallback>
                          <img src="https://i.pinimg.com/originals/47/30/38/473038bf60343d88ccb4188c0df1c544.jpg" />
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                          ${onlineUsers.includes(user.uid) ? "bg-green-500" : "bg-zinc-500"}
												`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white inline-flex">
                          {user.fullName}
                          {(() => {
                            const adminName = adminUser.find((a) => a.fullName === user.fullName);
                            return user.fullName === adminName?.fullName ? <span className="ml-2 text-red-500 font-extrabold shrink-0"><StarIcon /></span> : null;
                          })()}
                          {""}
                        </span>
                        {isPlaying && (
                          <Music className="size-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>

                      {isPlaying ? (
                        <div className="mt-1">
                          <div className="mt-1 text-sm text-purple-400 animate-pulse font-medium truncate pb-1">
                            {activity.replace("Playing ", "").split(" by ")[0]}
                          </div>
                          <div className="text-xs text-swatch-7 truncate">
                            {activity.split(" by ")[1]}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-swatch-5">Idle</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FriendsActivity;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-purple-100 to-swatch-5/50 rounded-full blur-lg
       opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-swatch-2/80 rounded-full p-4">
        <HeadphonesIcon className="size-8 text-swatch-5" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-white">
        See What Friends Are Playing
      </h3>
      <p className="text-sm text-zinc-400">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
