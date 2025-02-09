import { auth } from "./firebase.config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
  
} from "firebase/auth";

import { axiosInstance } from "@/lib/axios.js";


//This auth.js file works in sync with context API to provide authentication services. It uses Firebase Authentication for managing users and sign-in process.
//Context api (useAuth custom hook) provides with current session details
//This function holds auth functions like signIn, signUp, logout etc. and save to database 
//for eg: for signout: first  loggedIn(context api value) if true then signout()
//So both work hand in hand




// Save user to local MongoDB using Axios
const saveUserToLocalDB = async (user) => {
  if (!user || !user.uid) {
    console.error("Invalid user object:", user);
    return;
  }
  try {
    //lemme try get the ID token from the Firebase auth object
    // Get the ID token from Firebase Authentication
    //const token = await auth.currentUser.getIdToken();  //CLient side function to get the token provided by firebase
    //token is extracted in the authContext provider

    
    // Send the token to our server to save the user data in MongoDB
    console.log("Saving user to local DB:", user);
    await axiosInstance.post(`auth/auth-callback`,
      {
        fullName: user.displayName || "Unnamed User", // Assuming you get full name from Google
        uid: user.uid,
        imageUrl: user.photoURL || "", // Assuming you get image URL from Google
        email: user.email , 
      });
    console.log("User saved to local DB successfully.");
  } catch (error) {
    console.error(
      "Error saving user to local DB:",
      error.response?.data || error.message
    );
  }
};

// Create user with email and password and save to local MongoDB
export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  name
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // console.log("User created successfully:", user);

    // Set the displayName for the user
    await updateProfile(user, {
      displayName: name,
    });

    // Save user data to local MongoDB
    await saveUserToLocalDB(user);

    return user;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Optionally handle any additional logic here

    return user;
  } catch (error) {
    console.error("Error signing in:", error.response?.data || error.message);
    throw error;
  }
};

// Sign in with Google and save user to local MongoDB
export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user data to local MongoDB
    await saveUserToLocalDB(user);

    return user;
  } catch (error) {
    console.error(
      "Error signing in with Google:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Sign out the current user
export const doSignOut = async () => {
  try {
    await auth.signOut();
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error.response?.data || error.message);
  }
};

// export const doPasswordReset = (email) => {
//   return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//   return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//   return sendEmailVerification(auth.currentUser, {
//     url: `${window.location.origin}/home`,
//   });
// };
