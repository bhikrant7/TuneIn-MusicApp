import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";


export const getAllUsers = async (req, res, next) => {
    try {
        const currentUser = req.user.uid; //Current logged in user id
		const cUser = await User.findOne({ uid: currentUser })
        const users = await User.find().where('uid').ne(currentUser);   //users excluding the currentUser
        const admin = await User.find().where({isAdmin:true})
        return res.status(200).json({
            users: users,
            adminUser: admin,      // This could be an array of admin users or a single admin document
            currentUser: cUser, // In your case, it's just the uid
          });
    } catch (error) {
        next(error)
    }
}


export const getMessages = async (req, res, next) => {
	try {
		const myId = req.user.uid;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });
        console.log("message::",messages)

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

