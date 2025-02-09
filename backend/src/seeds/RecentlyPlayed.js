import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { ownSong } from "../models/ownSong.model.js";

import { config } from "dotenv";

config();

const songs = [
    
    {
        userId:"6793c4c97bd714a06b547908",
        title: "Urban Jungle",
        artist: "City Lights",
        imageUrl: "/cover-images/15.jpg",
        audioUrl: "/songs/15.mp3",
        duration: 36, // 0:36
    },
    {
        userId:"6793c4c97bd714a06b547908",
        title: "Crystal Rain",
        artist: "Echo Valley",
        imageUrl: "/cover-images/16.jpg",
        audioUrl: "/songs/16.mp3",
        duration: 39, // 0:39
    },
    {
        userId:"6793c4c97bd714a06b547908",
        title: "Neon Tokyo",
        artist: "Future Pulse",
        imageUrl: "/cover-images/17.jpg",
        audioUrl: "/songs/17.mp3",
        duration: 39, // 0:39
    },
    {
        userId:"6793c4c97bd714a06b547908",
        title: "Midnight Blues",
        artist: "Jazz Cats",
        imageUrl: "/cover-images/18.jpg",
        audioUrl: "/songs/18.mp3",
        duration: 29, // 0:29
    },
];

const seedSongs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing songs
        await ownSong.deleteMany({});

        // Insert new songs
        await ownSong.insertMany(songs);

        console.log("Songs seeded successfully!");
    } catch (error) {
        console.error("Error seeding songs:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSongs();