import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import { useAuth } from "@/context/authContext";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDispatch} from "react-redux";
import { useEffect, useRef } from "react";
import { searchMusic } from "@/store/Slices/useMusicSlice";


const Topbar = ({content,trigger}) => {
  


  const dispatch = useDispatch();
  const searchInputRef = useRef();


  useEffect(()=>{
    if(content){
      searchInputRef.current.value = content;
      handleSearch();
    }
    else{
      return
    }

  },[trigger])

  
  const handleSearch = () => {
    
    dispatch(searchMusic(searchInputRef.current.value));
    searchInputRef.current.value ="";
  }

  return (
    <div className="flex items-center justify-between rounded-md p-4 sticky top-0 bg-swatch-6/20  backdrop-blur-md z-10">
      <div className="flex gap-2 items-center text-xl font-bold text-swatch-5 cursor-default select-none hover:drop-shadow-[0_0_10px_#8d609a] hover:text-white/80 hover:transition duration-200 ease-in-out ">
        <Link to={"/"} className="flex items-center gap-2">
          <img
            src="/logo.png"
            className="size-10 drop-shadow-[0_0_1px_#8d609a] rounded-full"
            alt="App Logo"
          />
          <span className="collapse md:visible">TuneIn</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" className="italic" placeholder="songs or albums" ref={searchInputRef} />
          <Button
            variant="secondary"
            className="bg-gradient-to-br  from-swatch-5/40 via-purple-600/50 to-swatch-5/40  hover:bg-swatch-5/40 active:bg-purple-600/20"
            type="submit"
            onClick={handleSearch}

          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Topbar;
