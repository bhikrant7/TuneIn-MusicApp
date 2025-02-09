import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleOAuthButton from "./GoogleOAuthButton";
import { useAuth } from "@/context/authContext";
import { useSelector } from "react-redux";
import { buttonVariants } from "./ui/button";
import { SignOutButton } from "./SignOutButton";
import { cn } from "@/lib/utils";

const Topbar = () => {
  const { isAdmin } = useSelector((state) => state.useMyAuth);

  // console.log("Admin status", isAdmin);

  const { userLoggedIn, currentUser } = useAuth();
  // const {currentUser} = useAuth()
  //userLoggedIn = true;

  return (
    <div className="flex items-center justify-between rounded-md p-4 sticky top-0 bg-swatch-6/20  backdrop-blur-md z-10">
      <div className="flex gap-2 items-center text-xl font-bold text-swatch-5 cursor-default select-none hover:drop-shadow-[0_0_10px_#8d609a] hover:text-white/80 hover:transition duration-200 ease-in-out ">
        <Link to={"/"} className="flex items-center gap-2">
          <img
            src="/logo.png"
            className="size-10 drop-shadow-[0_0_1px_#8d609a] rounded-full"
            alt="App Logo"
          />
          TuneIn
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Show admin dashboard link only if user is an admin */}
        {currentUser && (
          <Link
            to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </Link>
        )}

        {/* Show Google Oauth button only if user not logged in */}
        {userLoggedIn ? <SignOutButton /> : <GoogleOAuthButton />}
      </div>
    </div>
  );
};
export default Topbar;
