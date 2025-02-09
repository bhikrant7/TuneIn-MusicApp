//authContext file
import React from "react";
import { auth } from "../../config/firebase.config.js";
import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useContext,useRef } from "react";
import { Loader } from "lucide-react";
import { axiosInstance } from "@/lib/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { checkAdminStatus } from "../../store/Slices/useAuthSlice/index.js";

import {
  disconnectSocketThunk,
  initSocketThunk,
} from "@/store/Slices/useChatSlice/index.js";

const AuthContext = React.createContext();

//For once and for all making sure that header with Bearer token is sent
const updateApiToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export function useAuth() {
  return useContext(AuthContext);
} //The useAuth() hook provides a convenient way for components to access the authentication state.

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  // currentUser: Stores the currently logged-in user object (if any).
  // userLoggedIn: A boolean flag indicating whether a user is currently logged in.
  // isEmailUser: A boolean flag indicating whether the user logged in with email/password.
  // isGoogleUser: A boolean flag indicating whether the user logged in with Google. (Currently commented out)
  // loading: A boolean flag to indicate whether the authentication state is still loading.

  // Subscribes to the onAuthStateChanged listener from Firebase.
  // This listener fires whenever the user's authentication state changes.

  //FOR SOCKET
  const dispatch = useDispatch();


  const socketUserIdRef = useRef(null); // Stores the current socket user ID
  useEffect(() => {
    return () => {
      if (socketUserIdRef.current) {
        console.log("Component unmounting, disconnecting socket for user:", socketUserIdRef.current);
        dispatch(disconnectSocketThunk());
        socketUserIdRef.current = null;
      }
    };
  }, []);
  

  //get the user doc from useChatslice for socket _id
  // const { currentUserFromRedux } = useSelector((state) => state.useChat);
  // //console.log(currentUserFromRedux._id)
  // useEffect(() => {
  //   if (currentUserFromRedux && currentUserFromRedux._id) {
  //     dispatch(initSocketThunk(currentUserFromRedux._id))
  //       .then(() =>
  //         console.log(
  //           "Socket initialized with user ID:",
  //           currentUserFromRedux._id
  //         )
  //       )
  //       .catch((err) => console.error("Socket init error:", err));
  //   }

  //   // Cleanup function: return a func that discons the socket
  //   return () => {
  //     dispatch(disconnectSocketThunk());
  //   };
  // }, [dispatch, currentUserFromRedux]);

  //___FOR SOCKET

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []); //empty dependency as only needed for the first time

  //A function that updates the authentication state based on the provided user object.
 async function initializeUser(user) {
  if (user) {
    try {
      setCurrentUser({ ...user });

      // Fetch Firebase Token
      const token = await user.getIdToken(true);
      updateApiToken(token);

      // Determine if the user used email/password or Google login
      setIsEmailUser(user.providerData.some((p) => p.providerId === "password"));
      setIsGoogleUser(user.providerData.some((p) => p.providerId === GoogleAuthProvider.PROVIDER_ID));

      setUserLoggedIn(true);

      if (token) {
        console.log("Admin status checking");
        dispatch(checkAdminStatus()); //checking for admin

        console.log("User ID (debugging 1):", user.uid);
        socketUserIdRef.current = user.uid; // Store user ID for cleanup

        dispatch(initSocketThunk(user.uid))
          .then(() => console.log("Socket initialized with user ID:", user.uid))
          .catch((err) => console.error("Socket init error:", err));
      }
    } catch (error) {
      updateApiToken(null);
      console.error("Error fetching Firebase Token:", error);
    }
  } else {
    // Cleanup: Disconnect the socket when the user logs out
    if (socketUserIdRef.current) {
      console.log("Cleaning up socket connection for user:", socketUserIdRef.current);
      dispatch(disconnectSocketThunk()); // Call the cleanup function
      socketUserIdRef.current = null; // Reset the ref
    }

    updateApiToken(null);
    setCurrentUser(null);
    setUserLoggedIn(false);
  }

  setLoading(false);
}


  // An object containing the relevant authentication state variables that are made available
  // to child components through the AuthContext.
  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-10 animate-spin text-purple-600" />
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

//Queries:
//why useEffect use empty dependency array? Answer: useEffect runs after the first render of a component, so an empty array means it only runs once.
//Why is AuthContext(custom) needed? Answer: It provides authentication state and methods to child components.
//Why AuthProvider used in App.jsx? Answer: It wraps the entire app with auth functionality, so any component can access it's values/methods. //The G

// Workflow
/*
  How It Works Step-by-Step:
1.The user opens the app: Firebase checks if the user is logged in.
initializeUser is called with the current user's data or null.

2.The user logs in:onAuthStateChanged triggers again.
initializeUser is called with the logged-in user's data.
The cleanup function (unsubscribe) stops the listener

3.The user logs out:onAuthStateChanged triggers again.
initializeUser is called with null.

4.The user navigates away, and the component unmounts:
The unsubscribe function stops the onAuthStateChanged listener.
*/

//Workflow:
