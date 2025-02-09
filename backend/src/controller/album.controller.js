import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";

// get all albums
export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

// get album by id
export const getAlbumById = async (req, res, next) => {
  try {
    //get the album by id and populate the songs field
    const album = await Album.findById(req.params.id).populate("songs"); //populate the songs field of the album

    if (!album) {
      res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

// get albums with tag

export const getAlbumByTag = async (req, res, next) => {
  try {
    //console.log("🔍 Received request at /api/albums/tags");

    const albums = await Album.find({
      tags: { $exists: true, $ne: [] },
    }).populate("songs");

    //console.log("✅ Albums found:", albums); // Debugging log

    res.status(200).json(albums);
  } catch (error) {
    console.error("❌ Error in getAlbumByTag:", error); // Log full error details
    // res.status(500).json({ message: "Internal Server Error", error: error.message });
    next(error);
  }
};

//create own playlist
export const createPlayList = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    if (!userId) {
      console.error("User not authenticated!");
      return res.status(401).json({ error: "User not authenticated!" });
    }
    
    if (!title) {
      return res.status(404).json({ message: "Title Not found!" });
    }

    const playlist = new Playlist({
      title,
      userId,
    });

    await playlist.save();
    res
      .status(201)
      .json({ message: "Playlist created successfully ", playlist });
  } catch (error) {
    console.error("Error creating playlist", error);
    next(error);
  }
};

//delete playlist
export const deletePlayList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Absent Playlist" });
    }

    if (!playlist.userId.equals(userId)) {
      return res.status(403).json({ message: "You can only delete your own playlists" });
    }

    await Playlist.findByIdAndDelete(id);

    res.status(200).json({ message: "Playlist deleted successfully", Id: id });
  } catch (error) {
    console.error("Error deleting playlist", error);
    next(error);
  }
};

//NOTE:
// you must convert songId to a mongoose.Types.ObjectId before using .equals().
//  The .equals() method is specifically designed for comparing MongoDB ObjectIds, not plain strings.

//add or delete song to playlist
export const updateSongToPlayList = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.query;
    const userId = req.user._id;

    if (!playlistId || !songId) {
      return res
        .status(400)
        .json({
          message: "Invalid request make sure you have all the missing Fields",
        });
    }
    const playlist = await Playlist.findById(playlistId);
    const song = await Song.findById(songId);
    if (!playlist || !song) {
      return res.status(404).json({ message: "Playlist or song not found" });
    }


    if (!playlist.userId.equals(userId)) {
      return res.status(403).json({ message: "You can only modify your own playlists" });
    }

    //Check if song already in playlist
    const songObjectId = new mongoose.Types.ObjectId(songId);

    const isSaved = playlist.songs.some((id) => id.equals(songObjectId));
    if (isSaved) {
      playlist.songs = playlist.songs.filter((id)=>!id.equals(songObjectId));
      await playlist.save();
      return res.status(200).json({ message: "This song is removed from the playlist",SongId:songId,isAdded:false });
    }else{
      playlist.songs.push(songObjectId);
      await playlist.save();
      return res.status(200).json({ message: "This song is added to the playlist",SongId:songId,isAdded:true });

    }

  } catch (error) {
    console.error("Error deleting playlist", error);
    next(error);
  }
};

//get all user playList
export const getAllPlaylists = async (req, res, next) => {
  try {
    // Ensure user ID is valid
    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const playlists = await Playlist.find({ userId });

    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found" });
    }

    return res.status(200).json(playlists);
  } catch (error) {
    console.error("Error getting all playlists", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//get a single user playlist
export const getPlaylistSongs = async (req, res, next) => {
  try{
   const userId= req.user._id;
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }
   const playlist  = await Playlist.findOne({ _id: id, userId}).populate('songs');

   if(!playlist){
     return res.status(404).json({ message: "No such playlist found"});
   }
   return res.status(200).json(playlist);
  }catch  (error) {
   console.error("Error getting a single playlist", error);
    next(error);
   }
};








 