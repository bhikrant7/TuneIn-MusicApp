import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectedUser } from "@/store/Slices/useChatSlice";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch

const UsersList = () => {
  const dispatch = useDispatch(); 
  const { users, selectedUser, isLoading, onlineUsers } = useSelector(
    (state) => state.useChat
  );

  return (
    <div className="border-r border-swatch-4/40">
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => dispatch(setSelectedUser(user))} //update selected user
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                    rounded-lg cursor-pointer transition-colors
                    ${
                      selectedUser?.uid === user.uid
                        ? "bg-swatch-2/70"
                        : "hover:bg-swatch-2/30"
                    }`}
                >
                  <div className="relative">
                    <Avatar className="size-8 md:size-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {/* online indicator */}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.includes(user.uid)
                            ? "bg-green-500"
                            : "bg-zinc-500"
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 lg:block hidden">
                    <span className="font-medium truncate">{user.fullName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
