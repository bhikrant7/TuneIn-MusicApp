import { User } from "../models/user.model.js";
import { protectRoute,requireAdmin } from "../middleware/auth.middleware.js";

// Check if user is present; if not, create a user
export const authCallback = async (req, res,next) => {
  try {
    let { uid, fullName, imageUrl,email } = req.body; // Destructure the incoming request data

    if (!uid) {
      return res.status(400).json({ success: false, message: "UID is required" });
    }

    if(imageUrl === ''){
      imageUrl = undefined;
    }

    // Check if the user exists in the database
    let user = await User.findOne({ uid });
    //console.log("User found:", user);

    if (!user) {
      // Create a new user if not found
      user = await User.create({
        uid,
        fullName,
        imageUrl,
        email,
      });
      console.log("User created:");
      

    } else {
      console.log("User already exists");
    }
    
    

    // for testing
    // const authHeader = req.headers.authorization;
    // const token = authHeader.split(' ')[1]; // Extract the token (after "Bearer")
    // console.log("Received Firebase Token:", token);
    // console.log("User data: ",req.user);
    // console.log("body data: ",req.body);
    // console.log("auth data: ",req.headers.authorization);

    // if(!token){
    //   return res.status(401).json({message:"No token provided"});
    // }


    //ends here for testing



    res.status(200).json({ success: true, 
     User : {
       uid,
       fullName,
       email,
       imageUrl,
      //  
     } });
  } catch (error) {
    console.error("Error in auth callback:", error);
    next(error);  //global middleware handles check index.js
  }
};
