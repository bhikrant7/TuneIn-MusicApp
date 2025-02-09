import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String, // Change ObjectId to String
      required: true,
    },
    receiverId: {
      type: String, // Change ObjectId to String
      required: true,
    },
    content: {
      type: String, // Ensure this is a string, not an object
      required: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
