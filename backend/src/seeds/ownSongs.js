// backend/src/seeds/ownSongs.js
import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";
import cloudinary from "../lib/cloudinary.js"; // your configured Cloudinary instance
import path from "path";
import { fileURLToPath } from "url";

config();

// Determine __dirname for an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compute the absolute path to the "frontend/public" folder.
// Your directory structure is assumed to be:
// ├── backend/
// │   └── src/
// │       └── seeds/ownSongs.js
// └── frontend/
//     └── public/
const publicFolderPath = path.join(__dirname, "../../../frontend/public");

// Helper function to upload a file to Cloudinary.
// The relativeFilePath should be relative to the "public" folder.
const uploadFile = async (relativeFilePath, options = {}) => {
  try {
    // Remove a leading slash if present and join with the public folder path.
    const filePath = path.join(publicFolderPath, relativeFilePath.replace(/^\//, ""));
    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${relativeFilePath}:`, error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Album.deleteMany({});
    await Song.deleteMany({});

    // **********************************************************************
    // STEP 1. Prepare songs data and upload image and audio files to Cloudinary
    // **********************************************************************

    const songsData = [
      // Bruno Mars Songs
      {
        title: "When I Was Your Man",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg", // relative to frontend/public
        audioUrl: "/songs/01 - Bruno Mars - When I Was Your Man.mp3", // relative to frontend/public
        plays: Math.floor(Math.random() * 5000),
        duration: 213,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "That's What I Like",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/02 - Bruno Mars - That's What I Like.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 206,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Just the Way You Are",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/03 - Bruno Mars - Just the Way You Are.mp3",
        duration: 220,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Leave The Door Open",
        artist: "Bruno Mars/Anderson Paak/Silk Sonic",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/04 - Bruno Mars - Leave The Door Open.mp3",
        duration: 242,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Locked out of Heaven",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/05 - Bruno Mars - Locked out of Heaven.mp3",
        duration: 233,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Uptown Funk (feat. Bruno Mars)",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/06 - Mark Ronson - Uptown Funk (feat. Bruno Mars).mp3",
        duration: 269,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Talking to the Moon",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/07 - Bruno Mars - Talking to the Moon.mp3",
        duration: 217,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Smokin Out The Window",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/08 - Bruno Mars - Smokin Out The Window.mp3",
        duration: 197,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "Treasure",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/09 - Bruno Mars - Treasure.mp3",
        duration: 178,
        tag: ["pop", "relaxing", "english"]
      },
      {
        title: "It Will Rain",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/10 - Bruno Mars - It Will Rain.mp3",
        duration: 257,
        tag: ["pop", "relaxing", "english"]

      },
      // ... add other Bruno Mars songs as needed

      // Nirvana Songs
      // Nirvana Songs
      {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/01. Smells Like Teen Spirit.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 300,
        tag: ["rock","grunge","english"]
      },
      {
        title: "In Bloom",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/02. In Bloom.mp3",
        duration: 248, // 0:24
        tag: ["rock","grunge","english"]
      },
      {
        title: "Come As You Are",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/03. Come As You Are.mp3",
        duration: 202, // 0:39
        tag: ["rock","grunge","english"]
      },
      {
        title: "Lithium",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/05. Lithium.mp3",
        duration: 249, // 0:17
        tag: ["rock","grunge","english"]
      },
      // ... add other Nirvana songs

      // Billie Eilish Songs
      // Billie Eilish Songs
      {
        title: "All the good girls go to hell",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish all the good girls go to hell.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 221,
        tag: ["pop", "english"]
      },
      {
		title: "bad guy",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish bad guy.mp3",
		duration: 206, // 0:17
        tag: ["pop", "english"]
	},
	{
		title: "Bellyache",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish Bellyache.mp3",
		duration: 210, // 0:17
        tag: ["pop", "english"]
	},
	{
		title: "Bury a friend",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish bury a friend.mp3",
		duration: 212, // 0:17
        tag: ["pop", "english"]
	},
	{
		title: "when the partys over",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish when the partys over.mp3",
		duration: 193, // 0:17
        tag: ["pop", "english"]
	},
	{
		title: "Ocean Eyes",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish Ocean Eyes.mp3",
		duration: 200, // 3:20
        tag: ["pop", "english"]
	},
	{
		title: "Hostage",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish hostage.mp3",
		duration: 229, // 3:49
        tag: ["pop", "english"]
	},
	{
		title: "everything i wanted",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish everything i wanted.mp3",
		duration: 245, // 4:05
        tag: ["pop", "english"]
	},
	{
		title: "Birds of a Feather",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish birds of a feather.mp3",
		duration: 207, // 3:27
        tag: ["pop", "english"]
	},
	{
		title: "Wildflower",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish wildflower.mp3",
		duration: 176, // 2:56
        tag: ["pop", "english"]
	},
	{
		title: "i dont wanna be you anymore",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish idontwannabeyouanymore Vertical Video.mp3",
		duration: 203, // 3:23
        tag: ["pop", "english"]
	},
	{
		title: "Lovely",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish Khalid lovely.mp3",
		duration: 200, // 3:20
        tag: ["pop", "english"]
	},
	{
		title: "my future",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish my future.mp3",
		duration: 210, // 3:30
        tag: ["pop", "english"]
	},
	{
		title: "Lo Vas A Olvidar",
		artist: "Billie Eilish",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/Billie Eilish ROSALÍA Lo Vas A Olvidar.mp3",
		duration: 204, // 3:24
        tag: ["pop", "english"]
	},
      // ... add other songs for Beatles, Weeknd, Queen, etc.

      // Beatles Songs
      {
        title: "Norwegian Wood",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/01 Norwegian Wood.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 125,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Do You Want To Know A Secret",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/02 Do You Want To Know A Secret.wav",
        duration: 117,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Michelle",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/03 Michelle.wav",
        duration: 160,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Nowhere Man",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/04 Nowhere Man.wav",
        duration: 163,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "This Boy",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/05 This Boy.wav",
        duration: 128,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Till There Was You",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/06 Till There Was You.wav",
        duration: 134,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Blackbird",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/07 Blackbird.wav",
        duration: 142,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "And I Love Her",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/08 And I Love Her.wav",
        duration: 149,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "She's Leaving Home",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/09 She's Leaving Home.wav",
        duration: 219,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Yes it Is",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/10 Yes it Is.wav",
        duration: 161,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Here There And Everywhere",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/11 Here There And Everywhere.wav",
        duration: 146,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "We Can Work It Out",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/12 We Can Work It Out.wav",
        duration: 135,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Eleanor Rigby",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/13 Eleanor Rigby.wav",
        duration: 127,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Penny Lane",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/14 Penny Lane.wav",
        duration: 180,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Here Comes The Sun",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/15 Here Comes The Sun.wav",
        duration: 186,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "I'll Be Back",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/16 I'll Be Back.wav",
        duration: 137,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "If I Fell",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/17 If I Fell.wav",
        duration: 139,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "In My Life",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/18 In My Life.wav",
        duration: 145,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Let It Be",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/19 Let It Be.wav",
        duration: 230,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Yesterday",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/20 Yesterday.wav",
        duration: 125,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Something",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/21 Something.wav",
        duration: 181,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "While My Guitar Gently Weeps",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/22 While My Guitar Gently Weeps.wav",
        duration: 264,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "I Am the Walrus",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/23 I Am the Walrus.wav",
        duration: 257,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Strawberry Fields Forever",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/24 Strawberry Fields Forever.wav",
        duration: 248,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      {
        title: "Hey Jude",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/25 Hey Jude.wav",
        duration: 371,
        tag: ["rock","60s" ,"relaxing", "english"]
      },
      // Weeknd Songs
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Blinding Lights.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 263,
        tag: ["pop","general", "english"]
      },
      {
        title: "Can't Feel My Face",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Can't Feel My Face.mp3",
        duration: 219,
        tag: ["pop","general", "english"]
      },
      {
        title: "Earned It",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Earned It.mp3",
        duration: 276,
        tag: ["pop","general", "english"]
      },
      {
        title: "Feel It Coming",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Feel It Coming ft. Daft Punk.mp3",
        duration: 298,
        tag: ["pop","general", "english"]
      },
      {
        title: "Snowchild",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Snowchild.mp3",
        duration: 252,
        tag: ["pop","general", "english"]
      },
      {
        title: "Starboy",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Starboy ft. Daft Punk.mp3",
        duration: 273,
        tag: ["pop","general", "english"]
      },
      {
        title: "The Hills",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/The Hills.mp3",
        duration: 234,
        tag: ["pop","general", "english"]
      },

      // Queen Songs
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Bohemian Rhapsody.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 355,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Another One Bites the Dust",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Another One Bites the Dust.mp3",
        duration: 215,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Radio Ga Ga",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Radio Ga Ga.mp3",
        duration: 343,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Save Me",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Save Me.mp3",
        duration: 228,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Invisible Man",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Invisible Man.mp3",
        duration: 235,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Love of My Life",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Love of My Life.mp3",
        duration: 179,
        tag: ["rock","80s", "english"]
      },
      {
        title: "Killer Queen",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Killer Queen.mp3",
        duration: 181,
        tag: ["rock","80s", "english"]
      },
      {
        title: "I Want to Break Free",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - I Want to Break Free.mp3",
        duration: 200,
        tag: ["rock","80s", "english"]
      }
    ];

    // Loop through each song and upload its image and audio files
    for (let song of songsData) {
      if (song.imageUrl) {
        // Upload the image file (assumes file exists in frontend/public/cover-images)
        const uploadedImageUrl = await uploadFile(song.imageUrl, {
          folder: "cover-images"
        });
        song.imageUrl = uploadedImageUrl;
      }
      if (song.audioUrl) {
        // Upload the audio file (assumes file exists in frontend/public/songs)
        // For audio files, we set resource_type to "video"
        const uploadedAudioUrl = await uploadFile(song.audioUrl, {
          folder: "songs",
          resource_type: "video"
        });
        song.audioUrl = uploadedAudioUrl;
      }
    }

    // Insert songs into the database
    const createdSongs = await Song.insertMany(songsData);

    // **********************************************************************
    // STEP 2. Create artist-specific albums (and upload album images)
    // **********************************************************************

    let artistAlbums = [
      {
        title: "Bruno Mars Hits",
        artist: "Bruno Mars",
        imageUrl: "/albums/Bruno.jpg", // relative to frontend/public
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "Bruno Mars").map(s => s._id)
      },
      {
        title: "Nevermind",
        artist: "Nirvana",
        imageUrl: "/albums/Nirvana-album.jpg",
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "Nirvana").map(s => s._id)
      },
      {
        title: "Billie Eilish Hits",
        artist: "Billie Eilish",
        imageUrl: "/albums/11.jpg",
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "Billie Eilish").map(s => s._id)
      },
      {
        title: "The Beatles Hits",
        artist: "The Beatles",
        imageUrl: "/albums/Beatles.jpg",
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "The Beatles").map(s => s._id)
      },
      {
        title: "The Weeknd Hits",
        artist: "The Weeknd",
        imageUrl: "/albums/Weeknd.png",
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "The Weeknd").map(s => s._id)
      },
      {
        title: "Queen Hits",
        artist: "Queen",
        imageUrl: "/albums/Queen.jpg",
        releaseYear: 2024,
        songs: createdSongs.filter(s => s.artist === "Queen").map(s => s._id)
      }
    ];

    // Upload album cover images before inserting albums into the DB
    for (let album of artistAlbums) {
      if (album.imageUrl) {
        const uploadedAlbumImage = await uploadFile(album.imageUrl, {
          folder: "albums"
        });
        album.imageUrl = uploadedAlbumImage;
      }
    }

    // Insert artist albums into the database and update songs with albumId
    const createdArtistAlbums = await Album.insertMany(artistAlbums);
    for (const album of createdArtistAlbums) {
      await Song.updateMany(
        { _id: { $in: album.songs } },
        { $set: { albumId: album._id } }
      );
    }

    // **********************************************************************
    // STEP 3. Process tag-based albums (upload default album image if needed)
    // **********************************************************************

    // Define the default album cover (relative to frontend/public)
    const defaultTagAlbumImagePath = "/albums/fxVE.gif";

    const processTagAlbums = async (song) => {
      for (const tag of song.tag) {
        const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        const albumTitle = `${formattedTag} Collection`;

        let album = await Album.findOne({ title: albumTitle });
        if (!album) {
          // Upload the default album cover for tag-based albums
          const uploadedDefaultImage = await uploadFile(defaultTagAlbumImagePath, {
            folder: "albums"
          });
          album = new Album({
            title: albumTitle,
            artist: "Various Artists",
            imageUrl: uploadedDefaultImage,
            releaseYear: new Date().getFullYear(),
            songs: [],
            tags: [tag]
          });
          await album.save();
        }
        // If the song is not already in the album, add it.
        if (!album.songs.includes(song._id)) {
          album.songs.push(song._id);
          await album.save();
        }
      }
    };

    // Process all songs for tag-based albums
    for (const song of createdSongs) {
      await processTagAlbums(song);
    }

    console.log("Database seeded successfully!");
    console.log(`Created ${createdSongs.length} songs`);
    console.log(`Created ${createdArtistAlbums.length} artist albums`);
    const tagAlbumsCount = await Album.countDocuments({ artist: "Various Artists" });
    console.log(`Created ${tagAlbumsCount} tag-based albums`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
