import admin from "../config/firebaseAdmin.config.js";
import { User } from "../models/user.model.js";

async function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
//console.log("Validate token checks and find token",token) //debug

    try {
        const decodedToken = await admin.auth().verifyIdToken(token); //decoded token will hold user info obtained from firebase token
        // req.user = decodedToken; // Add user data to request: this is called to populate

        // Fetch the corresponding MongoDB user by UID from Firebase
        const user = await User.findOne({ uid: decodedToken.uid }); //this is to ensure that req.user holds mongo db doc (_id, recentlyPlayed which is not present from firebase auth)
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Add the full user document to req.user

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        // console.error(`Token verification failed for route ${req.originalUrl}:`, error.message);

        // res.status(401).json({ message: 'Invalid token' });
        next(error)
    }
}

export default authenticateToken;

// On the backend, you cannot directly access the auth.currentUser.getToken() object because it only exists on the frontend.
// Instead, the backend receives the ID token from the request (sent by the frontend in the Authorization header).
// The line const token = req.headers.authorization?.split(' ')[1]; extracts the token for verification using the Firebase Admin SDK.


//Here the decodedToken is the user which is checked against the token 
//it consist of variety properties like email, role,name etc