import React from "react";
import AddPlaylistDialog from "./AddPlaylistDialog";
import { Button } from "@/components/ui/button";

const PlaylistInfo = () => {
  return (
    <>
      <div className="bg-gradient-to-tl from-pink-500/30 via-purple-700/40 to-swatch-5/50 p-4 rounded-md hover:bg-swatch-2/70 transition-all group cursor-pointer">
        
            <AddPlaylistDialog />
          
      </div>
    </>
  );
};

export default PlaylistInfo;
