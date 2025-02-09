import Topbar from "@/components/Topbar";
import { useEffect, useRef, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/authContext";
import { fetchMessagesThunk, fetchUsers } from "@/store/Slices/useChatSlice";
import { LoaderPinwheelIcon } from "lucide-react";
import MessageDisplay from "./components/MessageDisplay";

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { currentUser } = useAuth(); //this one doesnt have _id and is from firebase sdk

  //useRef to trigger the MessageDIsplay forward
  const msgRef = useRef(null);

  const [hoveredMessage, setHoveredMessage] = useState(null);

  const { messages, selectedUser, currentUserFromRedux } = useSelector(
    (state) => state.useChat
  );
  //console.log(" viru",currentUser)
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) dispatch(fetchUsers());
  }, [dispatch, currentUser]);

  useEffect(() => {
    console.log("useEffect triggered for selectedUser:", selectedUser?.uid);

    if (selectedUser) {
      console.log(
        `Fetching messages for ${
          selectedUser.uid
        } at ${new Date().toLocaleTimeString()}`
      );
      dispatch(fetchMessagesThunk(selectedUser.uid));
    }
  }, [selectedUser, dispatch]);

  //console.log("ChatPage re-rendered at:", new Date().toLocaleTimeString());

  console.log({ messages });

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-swatch-2/20 to-swatch-6/20 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        {/* chat message */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      onMouseEnter={() => setHoveredMessage(message._id)}
                      onMouseLeave={() => setHoveredMessage(null)}
                      className={`flex items-start gap-3 ${
                        message.senderId === currentUser?.uid
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === currentUser?.uid
                              ? currentUserFromRedux.imageUrl
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === currentUser?.uid ? "bg-green-500" : "bg-zinc-800"}
												`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      {message.senderId !== currentUser?.uid &&
                        hoveredMessage === message._id && (
                          <MessageDisplay
                            ref={msgRef}
                            hidden={true}
                            content={message.content}
                          />
                        )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <LoaderPinwheelIcon className="size-16 animate-spin text-swatch-4" />

    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
