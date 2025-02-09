import { ownSong } from "../models/ownSong.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";



// get all songs only for admin: NOT IMPLEMENTED
// get all songs including Song and OwnSong, avoiding repetition
export const getAllSongs = async (req, res, next) => {
  try {
    // Fetch all songs from both collections
    const songs = await Song.find().sort({ createdAt: -1 });
    const ownSongs = await OwnSong.find().sort({ createdAt: -1 });

    // Use a Set to avoid duplicate songs based on unique identifiers
    const songMap = new Map();

    // Add songs from the Song collection
    songs.forEach((song) => {
      songMap.set(song._id.toString(), song);
    });

    // Add songs from the OwnSong collection (skipping duplicates)
    ownSongs.forEach((song) => {
      if (!songMap.has(song._id.toString())) {
        songMap.set(song._id.toString(), song);
      }
    });

    // Convert the Map to an array
    const allSongs = Array.from(songMap.values());

    // Return the merged list of songs
    res.status(200).json(allSongs);
  } catch (error) {
    next(error);
  }
};

//get only unsynced SOngs:NOT IMPLEMENTED
export const getUnsyncedSongs = async (req, res, next) => {
  try {
    // Fetch unsynced songs
    const unsyncedSongs = await ownSong.find({ isSynced: false });

    res.status(200).json({
      message: "Unsynced songs fetched successfully",
      songs: unsyncedSongs,
    });
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};

//User can create a song which is not visible to others(public):NOT IMPLEMENTED
export const createUserSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Please upload an audio file and an image file" });
    }

    const { title, artist, albumId, duration, tag } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile); //from the function defined above
    const imageUrl = await uploadToCloudinary(imageFile); //upload image file to cloudinary

    const song = new ownSong({
      title,
      artist,
      audioUrl,
      imageUrl,
      albumId: albumId || null,
      duration,
      tag: tag || ["general", "relaxing"],
    });

    //upload audio file,update the album's song array
    // if (albumId) {
    //   const album = await Album.findByIdandUpdate(albumId, {
    //     $push: { songs: song._id },
    //   });
    //   if (!album) {
    //     return res.status(404).json({ message: "Album not found" });
    //   }
    // }

    await song.save();

    res
      .status(201)
      .json({ message: "User own Song created successfully ", song });
  } catch (error) {
    console.error(error);
    next(error);
  }
};








// //get all songs to user
export const getAllSongsByUser = async (req, res, next) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

// get songs by id: NOT USED
export const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
};

//NOTE: Need to send the songId
//Update the recently played songs for a user in the database
//Scenerios considered:
//Playing new songs, playing old songs again ,invalid song id, user not authenticated etc. are handled here.
export const updateRecentlyPlayed = async (req, res, next) => {
  try {
    const { songId } = req.params;
    // console.log("Got the post request", songId);
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not authenticated!" });
    }
    if (!songId) {
      return res.status(400).json({ message: "No song id provided." });
    }

    // Validate the songId
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }

    const newEntryUpdate = { songId: song._id, playedAt: Date.now() };

    // Remove existing entry if it exists in recentlyPlayed array
    user.recentlyPlayed = user.recentlyPlayed.filter(
      (entry) => entry.songId.toString() !== songId
    );

    // Add new entry to the beginning
    user.recentlyPlayed.unshift(newEntryUpdate);

    // Keep only last 10 entries
    if (user.recentlyPlayed.length > 10) {
      user.recentlyPlayed = user.recentlyPlayed.slice(0, 10);
    }

    // Save the user document
    await user.save();
    //error
    //when filtering, you're using strict comparison (entry.songId !== songId).
    // Since songId from req.params is a string, and entry.songId is an ObjectId, they won’t match.

    //DEBUGGING
    //   const debugUser = await user.populate({
    //     path: "recentlyPlayed.songId",
    //     select: "title artist imageUrl audioUrl albumId", // Select only relevant fields
    //   });

    // console.log("RECENTLYPLAED FIELD",debugUser.recentlyPlayed[0]); //DEBUG LOGGING

    res.status(200).json({ message: "Recently played updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating recently played list.", error });
    next(error);
  }
};

// get recently played songs
export const getRecentlyPlayedSong = async (req, res, next) => {
  try {
    // console.log("Returning fetch from server");
    const user = await User.findById(req.user._id)
      .populate({
        path: "recentlyPlayed.songId",
        select: "title artist imageUrl audioUrl albumId duration", // Select only relevant fields
      })
      .exec(); //exec means execute the query and return a promise

    if (!user || !user.recentlyPlayed || user.recentlyPlayed.length < 1) {
      return res
        .status(404)
        .json({ message: "No recently played songs found." });
    }

    // Sort the recentlyPlayed array by playedAt in descending order and get the last 4 songs
    const recentlyPlayedSongs = user.recentlyPlayed
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .slice(0);
    //console.log("Sorted Recently Played:", recentlyPlayedSongs); // Debugging
    if (!recentlyPlayedSongs) {
      return res.status(404).json({ message: "No recently played song found" });
    }
    res.status(200).json(recentlyPlayedSongs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error in getRecentlyPlayedSong", error });
    next(error);
  }
};

// get made for you songs which will randomly select 4 songs with similar tags of last 3 songs played by the user
//IMPORTANT: only when 3 songs are played then made for you section appears
// List of generic tags to be excluded for recommendation logic
const GENERIC_TAGS = ["english", "general"];

export const getMadeForYouSong = async (req, res, next) => {
  try {
    // Fetch the user with recently played songs populated
    const user = await User.findById(req.user._id)
      .populate({
        path: "recentlyPlayed.songId",
        select: "title artist imageUrl audioUrl albumId",
      })
      .exec();

    if (!user) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has at least 3 recently played songs
    if (!user.recentlyPlayed || user.recentlyPlayed.length < 3) {
      console.log("Not enough recently played songs.");
      return res
        .status(404)
        .json({ message: "At least 3 recently played songs are required." });
    }

    // Get the last 3 recently played songs (using slice(0, 3))
    const lastThreeSongsId = user.recentlyPlayed
      .slice(0, 3)
      .map((entry) => entry.songId?._id); // Check if songId exists

    // Validate that all song IDs are present
    if (lastThreeSongsId.includes(undefined)) {
      console.log("One or more songIds are missing in recently played.");
      return res
        .status(500)
        .json({ message: "Invalid song references in recently played." });
    }

    // Fetch the tags of the last 3 songs from the Song collection
    const songs = await Song.find({ _id: { $in: lastThreeSongsId } }).select(
      "tag"
    );

    if (!songs || songs.length === 0) {
      console.log("No songs found for the given song IDs.");
      return res
        .status(404)
        .json({ message: "No tags found for recently played songs." });
    }

    // Extract and flatten tags from the songs
    const songTags = songs.map((song) => song.tag).flat();
   // console.log("Extracted song tags:", songTags);

    if (!songTags.length) {
      console.log("No tags found for recently played songs.");
      return res
        .status(404)
        .json({ message: "No tags found for recently played songs." });
    }

    // Filter out generic tags to get more specific user tags
    const specificSongTags = songTags.filter(
      (tag) => !GENERIC_TAGS.includes(tag)
    );

    // If no specific tags remain after filtering, fallback to using all tags
    const userTags = specificSongTags.length ? specificSongTags : songTags;
   // console.log("User-specific tags for recommendation:", userTags);

    // Step 1: Weighted random matching of songs based on tag overlap
    let matchSongs = await Song.aggregate([
      {
        // Exclude songs that are already in the recently played list
        $match: {
          _id: { $nin: lastThreeSongsId },
        },
      },
      {
        // Compute how many tags match between the song and the user's tags
        $addFields: {
          matchedTags: {
            $size: { $setIntersection: ["$tag", userTags] },
          },
        },
      },
      {
        // Only consider songs that have at least one matching tag
        $match: {
          matchedTags: { $gt: 0 },
        },
      },
      {
        // Introduce a random factor weighted by the number of matching tags
        $addFields: {
          weightedScore: { $multiply: ["$matchedTags", { $rand: {} }] },
        },
      },
      {
        // Sort songs by the weighted random score in descending order
        $sort: { weightedScore: -1 },
      },
      {
        // Limit to 4 recommendations
        $limit: 4,
      },
      {
        // Project the required fields for the client
        $project: {
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
          duration: 1,
          tag: 1,
          albumId: 1,
          matchedTags: 1,
        },
      },
    ]);

   // console.log("Matched songs based on weighted random matching:", matchSongs);

    // Step 2: Fallback strategy if fewer than 4 songs were found
    const songsNeeded = 4 - matchSongs.length;
    if (songsNeeded > 0) {
      const fallbackSongs = await Song.aggregate([
        {
          $match: {
            _id: {
              $nin: [
                ...lastThreeSongsId,
                ...matchSongs.map((song) => song._id),
              ],
            },
          },
        },
        { $sample: { size: songsNeeded } },
        {
          $project: {
            title: 1,
            artist: 1,
            // Provide a default image if imageUrl is missing
            imageUrl: { $ifNull: ["$imageUrl", "/cover-images/Beatles.jpg"] },
            audioUrl: 1,
            duration: 1,
            tag: 1,
            albumId: 1,
          },
        },
      ]);

     // console.log("Fallback songs:", fallbackSongs);
      matchSongs = [...matchSongs, ...fallbackSongs];
    }

    // Remove any potential duplicates from matchSongs (just in case)
    const uniqueSongs = matchSongs.filter(
      (song, index, self) =>
        index === self.findIndex((s) => s._id.equals(song._id))
    );

    // Ensure exactly 4 songs are returned (if available)
    const finalSongs = uniqueSongs.slice(0, 4);
   // console.log("Final recommended songs:", finalSongs);

    res.status(200).json(finalSongs);
  } catch (error) {
    console.error("Server error in getMadeForYouSong:", error);
    res
      .status(500)
      .json({ message: "Server error in getMadeForYouSong", error });
    next(error);
  }
};


// get featured songs
export const getFeaturedSong = async (req, res, next) => {
  try {
    // get 6 random songs from the database
    const songs = await Song.aggregate([
      { $sample: { size: 6 } }, // get 6 random songs
      {
        $project: {
          //we only require this many fields from the database
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
          albumId: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

// get trending songs
export const getTrendingSong = async (req, res, next) => {
  try {
    const trendingSongs = await Song.find()
      .sort({ weeklyPlays: -1}) // Sort by highest weekly plays & likes
      .limit(10);
    res.json(trendingSongs);
  } catch (error) {
    next(error);
  }
};



//Post the favourite song //both insert or delete
export const updateFavSong = async (req, res, next) => {
  try {
    //console.log("API HIT: POST /fav-songs/:songId", req.params.songId);

    const { songId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      console.error("Invalid Song ID:", songId);
      return res.status(400).json({ message: "Invalid song ID format." });
    }

    const user = req.user;
    if (!user) {
      console.error("User not authenticated!");
      return res.status(401).json({ message: "User not authenticated!" });
    }

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      console.error("Song not found:", songId);
      return res.status(404).json({ message: "Song not found!" });
    }

   // console.log("Song exists. Processing favorite toggle...");

    // Convert to ObjectId for comparison
    const songObjectId = new mongoose.Types.ObjectId(songId);

    // Check if song is in user's favorites
    const isFav = user.favSongs.some((id) => id.equals(songObjectId));

    if (isFav) {
      user.favSongs = user.favSongs.filter((id) => !id.equals(songObjectId));
      await user.save();
      return res.status(200).json({ message: "Song removed from favorites", isAdded: false });
    } else {
      user.favSongs.unshift(songObjectId);
      await user.save();
      return res.status(200).json({ message: "Song added to favorites", isAdded: true });
    }
  } catch (error) {
    console.error("Error in updateFavSong:", error);
    res.status(500).json({ message: "Internal server error!", error });
    next(error);
  }
};


//fetch the favourite song

export const getFavSongs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "favSongs",
        select: "title artist imageUrl audioUrl albumId duration",
      })
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not authenticated!" });
    }

    if (!user.favSongs.length) {
      return res.status(404).json({ message: "No favorite songs found!" });
    }

    res.status(200).json(user.favSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!", error: error });
    next(error);
  }
};


