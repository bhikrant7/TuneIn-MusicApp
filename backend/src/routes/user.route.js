import express from 'express';
import { getAllUsers,getMessages } from '../controller/user.controller.js'; // Assuming that your controller file exports a function named getAllUsers
import { protectRoute,requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/',protectRoute, getAllUsers); //to view all authenticated(logged in) users
//todo : getMessages
router.get("/messages/:userId", protectRoute, getMessages);


export default router;
