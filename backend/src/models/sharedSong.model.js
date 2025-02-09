import mongoose from "mongoose";

const SharedSongSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    timestamp: { type: Date, default: Date.now },
  });
  

  export const sharedSong = mongoose.model("sharedSong", ownSongSchema);