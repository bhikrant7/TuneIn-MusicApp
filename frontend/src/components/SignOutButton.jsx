import { Button } from "./ui/button";
import { doSignOut } from "@/config/auth";  //auth.js
import { useAuth } from "@/context/authContext"; 
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector,useDispatch } from "react-redux";
import { setAdminFalse } from "@/store/Slices/useAuthSlice";

export const SignOutButton = () => {
  const {isAdmin} = useSelector((state) => state.useMyAuth); 
  const dispatch = useDispatch();

  const { userLoggedIn } = useAuth();  //context API
  
  const handleSignOut = async () => {
    if(isAdmin){
      dispatch(setAdminFalse())
    }
    await doSignOut(); // Wait for sign out action to complete

    toast.success("Signed Out!",{
      duration: 4000,  
      position: "top-center",  
      style: {
        background: "#341949",
        color: "#66FF00"
      }
    });
    // Hard refresh after toast
    setTimeout(() => {
      window.location.reload(true);
    }, 1000); // Delay to allow the toast to be visible
    

  };

  return (
    <>
      {userLoggedIn && 
        <Button onClick={handleSignOut} className="w-full flex items-center justify-center gap-x-3 p-2.5 border rounded-lg text-sm font-medium bg-swatch-2/50 hover:bg-swatch-4/50 transition duration-300 active:bg-gray-100" variant="outline"> Sign Out </Button>
      }
    </>
  );
};