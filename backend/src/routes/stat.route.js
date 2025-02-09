import express from 'express';
import { getStatData, getUserMonthlyStats, updateStatFav, updateStatPlay } from '../controller/stat.controller.js';
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/',protectRoute,getStatData);
router.get('/user/',protectRoute,getUserMonthlyStats);
router.post('/play/:songId',protectRoute,updateStatPlay);
router.post('/fav/:songId',protectRoute,updateStatFav);

export default router;