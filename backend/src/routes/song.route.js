import express from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getAllSongs,
  getSongById,
  getFeaturedSong,
  getMadeForYouSong,
  getRecentlyPlayedSong,
  getTrendingSong,
  updateRecentlyPlayed,
  getUnsyncedSongs,
  getAllSongsByUser,
  getFavSongs,
  updateFavSong
} from "../controller/song.controller.js";
const router = express.Router();


//Admin privileges required (check for admin)
router.get("/getAllSongs", protectRoute, requireAdmin, getAllSongs); //get all songs for admin
router.get("/getAllSongs/unsynced-songs", protectRoute, requireAdmin, getUnsyncedSongs); //get all unsyncsongs for admin

//You have to authenticated (no check for admin privileges)
router.get("/made-for-you",protectRoute, getMadeForYouSong); //get made for you songs
router.get("/recently-played",protectRoute, getRecentlyPlayedSong); //get recently played songs
router.post("/recently-played/:songId",protectRoute, updateRecentlyPlayed); //update recently played songs


router.post("/fav-songs/:songId",protectRoute, updateFavSong); //add or remove songs from fav
router.get("/fav-songs",protectRoute, getFavSongs); //get fav songs 

//can be accessed unauthenticated (no check for admin privileges)
router.get("/", getAllSongsByUser) //get all songs to display in now
router.get("/featured", getFeaturedSong); //get featured songs
router.get("/trending", getTrendingSong); //get trending songs
router.get("/:id", getSongById); //get song by id

export default router;
