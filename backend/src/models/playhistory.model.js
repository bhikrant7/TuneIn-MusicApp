import mongoose from "mongoose";

const PlayHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track who played the song
  songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
  playedAt: { type: Date, default: Date.now, index: { expires: '30d' } } // Auto-delete after 30 days
});


export const PlayHistory = mongoose.model("PlayHistory", PlayHistorySchema);