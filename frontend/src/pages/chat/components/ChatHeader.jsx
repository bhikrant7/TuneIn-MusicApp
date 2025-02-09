import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";


const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useSelector(state=> state.useChat)

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-zinc-800'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<p className={`text-sm font-mono ${onlineUsers.includes(selectedUser.uid) ? 'text-green-500 font-semibold' : 'text-zinc-400'}`}>
						{onlineUsers.includes(selectedUser.uid) ? "Online" : "Offline"}
					</p>
					<p className="text-xs italic text-red-400">Disclaimer* The forward button directly proceeds to search bar with the content of message</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;