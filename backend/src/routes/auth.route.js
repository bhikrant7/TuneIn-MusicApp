import express from 'express';
import { authCallback } from '../controller/auth.controller.js'; // Adjust the path as per your project structure

const router = express.Router();

// Route to save user to local MongoDB
router.post('/auth-callback', authCallback);

export default router;
