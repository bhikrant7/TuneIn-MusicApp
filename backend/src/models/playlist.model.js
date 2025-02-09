import mongoose from "mongoose";

// const playlistSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
//     timestamp: { type: Date, default: Date.now },
//   });

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
