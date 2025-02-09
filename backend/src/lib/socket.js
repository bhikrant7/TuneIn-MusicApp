import {Server} from "socket.io"
import {Message} from "../models/message.model.js"


export const initializeSocket = (server) =>{
    const io = new Server(server,{
        cors: {
            origin: "http://localhost:5173",
            credentials:true,  //send own credentials : true for auth
         }
    });

    const userSockets = new Map();  // {userId: socketId}
    const userActivities = new Map();  // {userId: activity}



    //On connecting to socket server runs event listerner
    io.on("connection",(socket)=>{
        //first connect events
        socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

            //broadcast to all users that user just logged in
            io.emit("user_connected", userId);  //emitted to other users

			socket.emit("users_online", Array.from(userSockets.keys()));  //User gets others users info(client to server emit)

			io.emit("activities", Array.from(userActivities.entries()));  //Sever updates everyone with latest user activity list
        });

        //activity change events
        socket.on("update_activity", ({ userId, activity }) => {  //When a user updates their activity (e.g., "Listening to music"), the server updates the userActivities map.
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

        //messaging
        socket.on("send_message", async (data) => {  //async coz I need to save the mesg log to db
			try {
				const { senderId, receiverId, content } = data;

				const message = await Message.create({  //after recieving msg data it is stored to db
					senderId,
					receiverId,
					content,
				});

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);   //can be get only when user online connected and set into userMap
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);   //The sender gets a confirmation if sent
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

        //disconnected
        socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) { //if finds a disconnected user broadcast it to other users
                
				io.emit("user_disconnected", disconnectedUserId);
			}
		});

    })

}