import { Button } from "@/components/ui/button";
import React from "react";
import { LucideForward } from "lucide-react";
import { Link } from "react-router-dom";

const MessageDisplay = ({ content }) => {
  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="bg-white/5 border-transparent hover:bg-white/15"
      >
        <Link to={`/explore/topbar/search?content=${content}`}>
          <LucideForward className="h-8 w-8" />
        </Link>
      </Button>
    </div>
  );
};

export default MessageDisplay;
