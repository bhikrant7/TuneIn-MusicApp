// Updated socketMiddleware
import socket from "@/lib/socket";

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState().usePlayer;
    // Get from Redux store

    // console.log(socket?.auth)
  
    if (socket?.auth) { // Align with Zustand's check
      switch (action.type) {
        case "usePlayer/setCurrentSong":
        case "usePlayer/playAlbum":
        case "usePlayer/playNext":
        case "usePlayer/playPrevious":
          if (state.currentSong && state.isPlaying) {
            socket.emit("update_activity", {
              userId: socket.auth.userId,
              activity: `Playing ${state.currentSong.title} by ${state.currentSong.artist}`
            });
          } else {
            socket.emit("update_activity", {
              userId: socket.auth.userId,
              activity: "Idle"
            });
          }
          break;
  
        case "usePlayer/togglePlay":
          const activity = state.isPlaying && state.currentSong
            ? `Playing ${state.currentSong.title} by ${state.currentSong.artist}`
            : "Idle";
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity
          });
          break;
  
        default:
          break;
      }
    }
  
    return result;
  };