
// import Register from "./pages/auth/register";
// import Login from "./pages/auth/login";

import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";

import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import RecentlyPlayed from "./pages/custompage/useCustomInfoPage";
import AdminPage from "./pages/admin/AdminPage";
import { AuthProvider } from "./context/authContext";
import { Route,Routes } from "react-router-dom";
import ExplorePage from "./pages/explore/ExplorePage";
import UserPage from "./pages/user/UserPage";
import PlayListPage from "./pages/explore/components/PlaylistComponent/PlayListPage";
import ChatPage from "./pages/chat/ChatPage";
import NotFoundPage from "./pages/404/NotFoundPage";

//import { Album } from "lucide-react";

function App() {
 
  return (
   
    <AuthProvider>
      <Routes>
        
        {/* <Route path="/auth-callback" element={<AuthCallBackPage />}/> */}
        <Route path="/user-dashboard" element={<UserPage />}/> 
        
        <Route path="/admin-dashboard" element={<AdminPage />}/> 
        


        <Route element={<MainLayout />}> 
        {/* Mainlayout is a component that wraps all the pages with common elements like header, footer etc. */}
          <Route path="/" element={<HomePage />}/>
          <Route path="/explore" element ={<ExplorePage />}/>
          <Route path="/explore/topbar/search" element={<ExplorePage />}/>
          <Route path="/chat" element ={<ChatPage />}/>
          <Route path="/albums/:albumId" element={<AlbumPage />}/>
          <Route path="/playlist/:playlistId" element={<PlayListPage />}/>
          <Route path="/user-songs-info/:infoPage" element={<RecentlyPlayed />}/> 
          <Route path="/*" element={<NotFoundPage />}/> 

          
          
        </Route>

      </Routes>
      <Toaster />
    
    </AuthProvider>
  )
}

export default App;