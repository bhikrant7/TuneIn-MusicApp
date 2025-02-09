import express from "express";
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  adminCheck,
  syncAllUnsyncedOwnSongsToPublic,
  syncSingleSong,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute, requireAdmin); //this middleware will run before any of the routes below

router.get("/check", adminCheck); //MAINLY to maintain the state mentioning the role of user in the top right
//the protectRoute and requireAdmin middleware will run before the createSong function
//the protectRoutes will check if the user is authenticated on the basis of bearer token and the requireAdmin will check if the user is an admin
router.post("/songs", createSong);
router.post("/songs/:id", deleteSong);
router.post("/unsyncedownsongs/all", syncAllUnsyncedOwnSongsToPublic);
router.post("/unsyncedownsongs/:id",syncSingleSong);

//We should also be able to create and deleteAlbums
router.post("/albums", createAlbum);
router.post("/albums/:id", deleteAlbum);

export default router;
