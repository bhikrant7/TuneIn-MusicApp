import mongoose from "mongoose";

const ownSongSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who uploaded this song

    title: {
      type: String,
      required: true,
    },
    // count:{ //to keep track of how many times played
    //     type: Number,
    //     required:true,
    // },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
    tag: {  // Tags for the song
      type: [String],
      default: ["general", "relaxing","english"], // Default tags
    },
    isSynced: { type: Boolean, default: false }, // Admin approval status
    syncedSongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' }, // Reference to main song DB if synced
  },
  { timestamps: true }
);

export const ownSong = mongoose.model("ownSong", ownSongSchema);
