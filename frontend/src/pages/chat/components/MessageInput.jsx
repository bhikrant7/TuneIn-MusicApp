import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { sendMessageThunk } from "@/store/Slices/useChatSlice";
import { Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MessageInput = () => {
    const dispatch =  useDispatch();
	const [newMessage, setNewMessage] = useState("");
	const { currentUser } = useAuth()
	const { selectedUser } = useSelector(state=>state.useChat)

	const handleSend = () => {
        if (!selectedUser || !currentUser || !newMessage) {
          console.warn("Missing data:", { selectedUser, currentUser, newMessage });
          return;
        }

      
        dispatch(
          sendMessageThunk({
            receiverId: selectedUser.uid,
            senderId: currentUser.uid,
            content: newMessage.trim(),
          })
        );
      
        setNewMessage("");
      };
      

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-swatch-2/80 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;