import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { ownSong } from "../models/ownSong.model.js";
import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";



// Admin syncs all songs from OwnSong into Song (public)
export const syncAllUnsyncedOwnSongsToPublic = async (req, res, next) => {
  try {
    // Fetch all songs from OwnSong that are not yet synced
    const ownSongs = await ownSong.find({ isSynced: false });

    // Track how many songs were synced
    let syncedCount = 0;

    // Iterate through the unsynced songs
    for (const ownSong of ownSongs) {
      // Check if the song already exists in the Song collection
      const exists = await Song.findOne({
        title: ownSong.title,
        artist: ownSong.artist,
      });

      if (!exists) {
        // If the song doesn't exist in the Song collection, create it
        const newSong = new Song({
          title: ownSong.title,
          artist: ownSong.artist,
          imageUrl: ownSong.imageUrl,
          audioUrl: ownSong.audioUrl,
          duration: ownSong.duration,
          albumId: ownSong.albumId,
          tag: ownSong.tag,
          // addedBy: ownSong.userId, // Track the user who added the song
          // createdAt: ownSong.createdAt, // Preserve the original creation date
        });

        // Save the new song to the Song collection
        const savedSong = await newSong.save();

        // Update the `OwnSong` to mark it as synced and reference the `Song` ID
        ownSong.isSynced = true;
        ownSong.syncedSongId = savedSong._id;
        await ownSong.save();

        syncedCount++;
      } else {
        // If the song exists, optionally log or skip
        console.log(
          `Song "${ownSong.title}" by "${ownSong.artist}" already exists in the Song collection.`
        );
      }
    }

    // Respond with the result of the sync operation
    res.status(200).json({
      message: "Sync complete",
      synced: syncedCount,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

//Admin syncs particular songs from OwnSong into Song (public)
export const syncSingleSong = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract song ID from the route parameters

    // Fetch the song
    const song = await ownSong.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.isSynced) {
      return res.status(400).json({ message: "Song is already synced" });
    }

    // Check if the song exists in the public Song collection
    const exists = await Song.findOne({
      title: song.title,
      artist: song.artist,
    });

    if (!exists) {
      // Create and save the new song
      const newSong = new Song({
        title: song.title,
        artist: song.artist,
        imageUrl: song.imageUrl,
        audioUrl: song.audioUrl,
        duration: song.duration,
        albumId: song.albumId,
        tag: song.tag,
      });

      const savedSong = await newSong.save();

      // Mark the song as synced
      song.isSynced = true;
      song.syncedSongId = savedSong._id;
      await song.save();

      return res.status(200).json({
        message: "Song synced successfully",
        song: savedSong,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Song already exists in the public collection" });
    }
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
};






// Import the cloudinary package
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading file to cloudinary", error);
    throw new Error("Error uploading file to cloudinary");
  }
};

// Create a new song
//The Validates if required files (audio and image) are uploaded in the request.
// Uploads these files to cloud storage service and retrieves their URLs.
// Creates a new song document with details from the request body.
// Handles album creation and updates, adding newly created song to respective albums.
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Please upload an audio file and an image file" });
    }

    const { title, artist, albumId, duration, tag } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // Upload files to Cloudinary (or equivalent service)
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    // Create the song
    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      albumId: albumId || null,
      duration,
      tag: tag || ["general", "relaxing","english"], // Default tags if none are provided
    });

    // Automatically assign song to tag-based albums
    for (const singleTag of song.tag) {
      const tagName = singleTag.charAt(0).toUpperCase() + singleTag.slice(1); //capitalize the first letter of the tag

      // Check if an album for this tag exists
      let album = await Album.findOne({ title: `${tagName} Collection` });

      if (!album) {
        // Create a new album for the tag if it doesn't exist
        album = new Album({
          title: `${tagName} Collection`,
          artist: "Various Artists",
          imageUrl: "/albums/fxVE.gif", // Default image URL for tag-based albums
          releaseYear: new Date().getFullYear(),
          songs: [],
          tags: singleTag, // Add the tag to the album
        });
        await album.save();
      }

      // Add the song to the album if not already added
      if (!album.songs.includes(song._id)) {
        album.songs.push(song._id);
        await album.save();
      }
    }

    // Add the song to a specific album if `albumId` is provided
    if (albumId) {
      const album = await Album.findByIdAndUpdate(
        albumId,
        { $push: { songs: song._id } },
        { new: true } // Return the updated album
      );

      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
    }

    await song.save();

    res.status(201).json({ message: "Song created successfully", song });
  } catch (error) {
    console.error("Error creating song:", error);
    next(error);
  }
};



//delete a song
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id); //find the song by id

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: id },
      });
    }

    await Song.findByIdAndDelete(id); //delete the song

    res.status(200).json({ message: "Song deleted successfully",songId: id });

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Create a new album
export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const { title, artist, releaseYear,tags } = req.body;
    const imageFile = req.files.imageFile;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
      tags
    });

    await album.save();

    res.status(201).json({ message: "Album created successfully ", album });
  } catch (error) {
    console.error("Error creating album", error);
    next(error);
  }
};

//delete an album
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully",albumId:id });
  } catch (error) {
    console.error("Error deleting album", error);
    next(error);
  }
};

//handler to check admin
export const adminCheck = async (req, res) => {
  //RMBR
  // console.log("Checked for Admin.Its true.Now refresh token")
  const currentUserId = req.user.id;
  await User.findByIdAndUpdate(currentUserId, { isAdmin: true });
  //console.log(req.user)

  res.status(200).json({
    success: true,
    message: "Admin role assigned. Please reauthenticate.",
    tokenExpired: true, // 🔥 Tell frontend to refresh token
  });
};
