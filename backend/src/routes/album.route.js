import express from 'express';
import { getAllAlbums,getAlbumById,getAlbumByTag, createPlayList, deletePlayList, updateSongToPlayList, getAllPlaylists, getPlaylistSongs } from '../controller/album.controller.js';
import { protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();


router.get('/',getAllAlbums); //get all albums

// Route to fetch all auto-generated albums based on tags
router.get('/tags', getAlbumByTag);

router.get('/:id',getAlbumById); //get album by id



router.post('/playlist/create',protectRoute,createPlayList)  //create a personalized playlist
router.post('/playlist/delete/:id',protectRoute,deletePlayList)  //create a personalized playlist
// router.post('/playlist/updateSong?playlistId=:id&songId=:songId',protectRoute,updateSongToPlayList)  //add song to playlist
router.post('/playlist/updateSong',protectRoute,updateSongToPlayList)  //add song to playlist

router.get('/playlist/all',protectRoute,getAllPlaylists) //get all playlist for the user
router.get('/playlist/:id',protectRoute,getPlaylistSongs) //open single playlist





export default router;