import authenticateToken from "./validateToken.js";
import admin from '../config/firebaseAdmin.config.js';  // Import the admin instance from the config file


import dotenv from 'dotenv';
dotenv.config();



//just add these middleware like
//router.get("/admin-only", protectRoute, requireAdmin, adminHandler);

//protectRoute simple function the checks the req.user
export const protectRoute = async (req, res, next) => { //now middleware chaining
  authenticateToken(req, res, async (err) => { //async because we are using firebase token verification here which is promise based operation
    
    if (err) {
      return res.status(401).json({ message: "Authentication failed." });
    }
    if (!req.user) { //if  no user data then return error

      return res
        .status(403)
        .json({ message: "Access denied. No user information found." });
    }
    next(); // // Continue to the next middleware or route handler on success
  });
};

//requireAdmin simple function to check privileges
// Ensure user is authenticated (protectRoute runs before this)
export const requireAdmin = async (req, res, next) => {
  try {
    // if (!req.user) {
    //   return res.status(401).json({ message: "Unauthorized. Please log in." });
    // }

    const { email, uid } = req.user;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Get fresh user data
    //The middleware itself does not directly update the HTTP headers(req.user(which holds mongo User document data)). 
    // It freshly gets user data from firebase based on the uid from req.user and check any claim
    const userRecord = await admin.auth().getUser(uid);

    // Check if user already has admin claim
    if (userRecord.customClaims?.admin) {
      req.userRecord = userRecord;
      return next();
    }
    // Set admin claim if email matches
        if (email === adminEmail) {
          await admin.auth().setCustomUserClaims(uid, { admin: true });
          // Revoke all refresh tokens for a user
          await admin.auth().revokeRefreshTokens(uid);
          // The client must reauthenticate: When the client attempts to use a revoked token, Firebase will require it to fetch a fresh token.
          
          // New token will contain updated claims: After reauthentication, the client's token will include the admin: true claim if assigned.
          
          // Get updated user record
          const updatedUser = await admin.auth().getUser(uid);
          req.userRecord = updatedUser;
          
          console.log(`Admin role assigned to user ${uid}`);
        } else {
          // Not an admin, but still continue to next middleware
          req.userRecord = userRecord;
        }

    // Check if the user has an admin role
    if (!req.userRecord?.customClaims?.admin) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    next();
  } catch (error) {
    console.error('Admin check failed:', error);
    return next(error)
    // return res.status(500).json({ 
    //   success: false, 
    //   message: "Internal server error", 
    //   error: error.message 
    // });
  }
};
