import { Outlet } from "react-router-dom";
import PlaybackControls from "./components/PlaybackControls";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";

const MainLayout = () => {
  const isMobile = false; //just for now redux store

  return (
    <div className="h-screen bg-swatch-1 text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >

        
        {/* This will not be visible it is just for functionality or handling playing of songs over entire app */}
        <AudioPlayer /> 


        {/* left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          {/* leftSideBar */}
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-swatch-1 rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
          {/* Outlet is used to render the current route component. It's like a placeholder for the current page content. child component holder */}
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-1 bg-swatch-1 rounded-lg transition-colors" />

            {/* right sidebar */}
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
