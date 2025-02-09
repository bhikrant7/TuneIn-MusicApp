import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
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
    playCount: { type: Number, default: 0 }, //total plays
    weeklyPlays: { type: Number, default: 0 }, //weekly plays
    favs: { type: Number, default: 0 }, // favorites
    tag: {
      // Tags for the song
      type: [String],
      default: ["general", "relaxing", "english"], // Default tags
    },
    lastPlayed: Date,
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
