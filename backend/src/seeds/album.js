import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Album.deleteMany({});
    await Song.deleteMany({});

    // First, create all songs
    const createdSongs = await Song.insertMany([
      //Bruno
      {
        title: "When I Was Your Man",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/01 - Bruno Mars - When I Was Your Man.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 213,
      },
      {
        title: "That's What I Like",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/02 - Bruno Mars - That's What I Like.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 206,
      },
      {
        title: "Just the Way You Are",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/03 - Bruno Mars - Just the Way You Are.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 220,
      },
      {
        title: "Leave The Door Open",
        artist: "Bruno Mars/Anderson Paak/Silk Sonic",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/04 - Bruno Mars - Leave The Door Open.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 242,
      },
      {
        title: "Locked out of Heaven",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/05 - Bruno Mars - Locked out of Heaven.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 233,
      },
      {
        title: "Uptown Funk (feat. Bruno Mars)",
        artist: "Mark Ronson/Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl:
          "/songs/06 - Mark Ronson - Uptown Funk (feat. Bruno Mars).mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 269,
      },
      {
        title: "Talking to the Moon",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/07 - Bruno Mars - Talking to the Moon.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 217,
      },
      {
        title: "Smokin Out The Window",
        artist: "Bruno Mars/Anderson Paak/Silk Sonic",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/08 - Bruno Mars - Smokin Out The Window.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 197,
      },
      {
        title: "Treasure",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/09 - Bruno Mars - Treasure.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 178,
      },
      {
        title: "It Will Rain",
        artist: "Bruno Mars",
        imageUrl: "/cover-images/Bruno.jpg",
        audioUrl: "/songs/10 - Bruno Mars - It Will Rain.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 257,
      },
      //Nirvana
      {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/01. Smells Like Teen Spirit.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 300, // 0:27
      },
      {
        title: "In Bloom",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/02. In Bloom.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 248, // 0:24
      },
      {
        title: "Come As You Are",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/03. Come As You Are.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 202, // 0:39
      },
      {
        title: "Lithium",
        artist: "Nirvana",
        imageUrl: "/cover-images/Nirvana.jpg",
        audioUrl: "/songs/05. Lithium.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 249, // 0:17
      },
      //Billie Eilish
      {
        title: "All the good girls go to hell",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish all the good girls go to hell.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 221, // 3:41
      },
      {
        title: "bad guy",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish bad guy.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 206, // 0:17
      },
      {
        title: "Bellyache",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish Bellyache.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 210, // 0:17
      },
      {
        title: "Bury a friend",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish bury a friend.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 212, // 0:17
      },
      {
        title: "when the partys over",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish when the partys over.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 193, // 0:17
      },
      {
        title: "Ocean Eyes",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish Ocean Eyes.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 200, // 3:20
      },
      {
        title: "Hostage",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish hostage.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 229, // 3:49
      },
      {
        title: "everything i wanted",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish everything i wanted.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 245, // 4:05
      },
      {
        title: "Birds of a Feather",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish birds of a feather.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 207, // 3:27
      },
      {
        title: "Wildflower",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish wildflower.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 176, // 2:56
      },
      {
        title: "idontwannabeyouanymore",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl:
          "/songs/Billie Eilish idontwannabeyouanymore Vertical Video.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 203, // 3:23
      },
      {
        title: "Lovely",
        artist: "Billie Eilish & Khalid",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish Khalid lovely.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 200, // 3:20
      },
      {
        title: "my future",
        artist: "Billie Eilish",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish my future.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 210, // 3:30
      },
      {
        title: "Lo Vas A Olvidar",
        artist: "Billie Eilish & ROSALÍA",
        imageUrl: "/cover-images/11.jpg",
        audioUrl: "/songs/Billie Eilish ROSALÍA Lo Vas A Olvidar.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 204, // 3:24
      },

      //BEATLES

      {
        title: "Norwegian Wood",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/01 Norwegian Wood.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 125,
      },
      {
        title: "Do You Want To Know A Secret",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/02 Do You Want To Know A Secret.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 117,
      },
      {
        title: "Michelle",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/03 Michelle.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 160,
      },
      {
        title: "Nowhere Man",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/04 Nowhere Man.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 163,
      },
      {
        title: "This Boy",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/05 This Boy.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 128,
      },
      {
        title: "Till There Was You",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/06 Till There Was You.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 134,
      },
      {
        title: "Blackbird",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/07 Blackbird.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 142,
      },
      {
        title: "And I Love Her",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/08 And I Love Her.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 149,
      },
      {
        title: "She's Leaving Home",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/09 She's Leaving Home.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 219,
      },
      {
        title: "Yes it Is",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/10 Yes it Is.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 161,
      },
      {
        title: "Here There And Everywhere",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/11 Here There And Everywhere.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 146,
      },
      {
        title: "We Can Work It Out",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/12 We Can Work It Out.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 135,
      },
      {
        title: "Eleanor Rigby",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/13 Eleanor Rigby.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 127,
      },
      {
        title: "Penny Lane",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/14 Penny Lane.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 180,
      },
      {
        title: "Here Comes The Sun",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/15 Here Comes The Sun.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 186,
      },
      {
        title: "I'll Be Back",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/16 I'll Be Back.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 137,
      },
      {
        title: "If I Fell",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/17 If I Fell.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 139,
      },
      {
        title: "In My Life",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/18 In My Life.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 145,
      },
      {
        title: "Let It Be",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/19 Let It Be.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 230,
      },
      {
        title: "Yesterday",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/20 Yesterday.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 125,
      },
      {
        title: "Something",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/21 Something.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 181,
      },
      {
        title: "While My Guitar Gently Weeps",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/22 While My Guitar Gently Weeps.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 264,
      },
      {
        title: "I Am the Walrus",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/23 I Am the Walrus.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 257,
      },
      {
        title: "Strawberry Fields Forever",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/24 Strawberry Fields Forever.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 248,
      },
      {
        title: "Hey Jude",
        artist: "The Beatles",
        imageUrl: "/cover-images/Beatles.jpg",
        audioUrl: "/songs/25 Hey Jude.wav",
        plays: Math.floor(Math.random() * 5000),
        duration: 371,
      },

      //Weekend
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Blinding Lights.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 263,
      },
      {
        title: "Can't Feel My Face",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Can't Feel My Face.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 219,
      },
      {
        title: "Earned It",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Earned It.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 276,
      },
      {
        title: "Feel It Coming",
        artist: "The Weeknd ft. Daft Punk",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Feel It Coming ft. Daft Punk.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 298,
      },
      {
        title: "Snowchild",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Snowchild.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 252,
      },
      {
        title: "Starboy",
        artist: "The Weeknd ft. Daft Punk",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/Starboy ft. Daft Punk.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 273,
      },
      {
        title: "The Hills",
        artist: "The Weeknd",
        imageUrl: "/cover-images/Weeknd.jpg",
        audioUrl: "/songs/The Hills.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 234,
      },

      //Queen
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Bohemian Rhapsody.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 355,
      },
      {
        title: "Another One Bites the Dust",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Another One Bites the Dust.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 215,
      },
      {
        title: "Radio Ga Ga",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Radio Ga Ga.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 343,
      },
      {
        title: "Save Me",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Save Me.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 228,
      },
      {
        title: "Invisible Man",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Invisible Man.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 235,
      },
      {
        title: "Love of My Life",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Love of My Life.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 179,
      },
      {
        title: "Killer Queen",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - Killer Queen.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 181,
      },
      {
        title: "I Want to Break Free",
        artist: "Queen",
        imageUrl: "/cover-images/Queen.jpg",
        audioUrl: "/songs/Queen - I Want to Break Free.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 200,
      },
    ]);

    // Create albums with references to song IDs
    const albums = [
      {
        title: "Bruno Mars Hits",
        artist: "Bruno Mars",
        imageUrl: "/albums/Bruno.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(0, 10).map((song) => song._id),
      },
      {
        title: "Nevermind",
        artist: "Nirvana",
        imageUrl: "/albums/Nirvana-album.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(10, 14).map((song) => song._id),
      },
      {
        title: "Billie Eilish Hits",
        artist: "Billie Eilish",
        imageUrl: "/albums/11.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(14, 28).map((song) => song._id),
      },
      {
        title: "The Beatles Hits",
        artist: "The Beatles",
        imageUrl: "/albums/Beatles.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(28, 53).map((song) => song._id),
      },
      {
        title: "The Weeknd Hits",
        artist: "The Weeknd",
        imageUrl: "/albums/Weeknd.png",
        releaseYear: 2024,
        songs: createdSongs.slice(53, 60).map((song) => song._id),
      },
      {
        title: "Queen Hits",
        artist: "Queen",
        imageUrl: "/albums/Queen.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(60, 68).map((song) => song._id),
      },
    ];

    // Insert all albums
    const createdAlbums = await Album.insertMany(albums);

    // Update songs with their album references
    for (let i = 0; i < createdAlbums.length; i++) {
      const album = createdAlbums[i];
      const albumSongs = albums[i].songs;

      await Song.updateMany(
        { _id: { $in: albumSongs } },
        { albumId: album._id }
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
