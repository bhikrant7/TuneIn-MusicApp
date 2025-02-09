import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//fetch All Playlist
export const fetchAllPlaylist = createAsyncThunk(
  "fetchAllPlaylist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("albums/playlist/all");
      return response.data;
    } catch (error) {
      console.error("Error in fetching All Playlist", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in fetching Playlists"
      );
    }
  }
);

//fetch id Playlist
export const fetchPlaylistById = createAsyncThunk(
  "fetchAllPlaylistById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`albums/playlist/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in fetching All Playlist", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in fetching Playlists"
      );
    }
  }
);

//post/or del songs to play
export const postSongToPlaylist = createAsyncThunk(
    "postSongToPlaylist",
    async ({ playlistId, songId }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          `albums/playlist/updateSong?playlistId=${playlistId}&songId=${songId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error in posting song to playlist", error);
        return rejectWithValue(
          error.response?.data?.message || "Error in posting song to playlist"
        );
      }
    }
  );
  

//delete playlist
export const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `albums/playlist/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in deleting playlist", error);
      return rejectWithValue(
        error.response?.data?.message || "Error in deleting playlist"
      );
    }
  }
);

const usePlaylistSlice = createSlice({
  name: "usePlaylist",
  initialState: {
    playlists: [],
    playlistSongs: [],
    isLoadingForPlayL: false,
    currentPlaylist: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //fetchAllPlaylists
    builder.addCase(fetchAllPlaylist.pending, (state) => {
      state.isLoadingForPlayL = true;
      state.error = null;
    });
    builder.addCase(fetchAllPlaylist.fulfilled, (state, action) => {
      state.playlists = action.payload;
      state.isLoadingForPlayL = false;

      // console.log("PLAYLISTS:",action.payload)
    });
    builder.addCase(fetchAllPlaylist.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoadingForPlayL = false;
    });

    //fetchPlaylistById
    builder.addCase(fetchPlaylistById.pending, (state) => {
      state.isLoadingForPlayL = true;
      state.error = null;
    });
    builder.addCase(fetchPlaylistById.fulfilled, (state, action) => {
      state.currentPlaylist = action.payload;
      state.playlistSongs = action.payload.songs;
      state.isLoadingForPlayL = false;
    });
    builder.addCase(fetchPlaylistById.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoadingForPlayL = false;
    });

    //deletePlaylist

    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.playlists = state.playlists.filter(
        (pl) => pl._id !== action.payload?.Id
      );
      state.isLoadingForPlayL = false;
      toast.success("Playlist deleted successfully! 🎉", {
        duration: 4000, // How long the toast stays (in ms)
        position: "top-center", // Position of the toast
        style: {
          background: "#341949",
          color: "#66FF00",
        },
      });
    });
    builder.addCase(deletePlaylist.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoadingForPlayL = false;
      toast.error("Playlist deletion failed!", {
        duration: 4000, // How long the toast stays (in ms)
        position: "top-center", // Position of the toast
        style: {
          background: "#341949",
          color: "#FF0000",
        },
      });
    });

    //postSongToPlaylist
    builder.addCase(postSongToPlaylist.pending, (state) => {
      state.isLoadingForPlayL = true;
      state.error = null;
    });
    builder.addCase(postSongToPlaylist.fulfilled, (state, action) => {
      if (action.payload?.isAdded === true) {
        toast.success("Song added successfully! 🎉", {
          duration: 2000, // How long the toast stays (in ms)
          position: "top-center", // Position of the toast
          style: {
            background: "#341949",
            color: "#66FF00",
          },
        });
      } else {
        toast.success("Song removed to playlist 😔", {
          duration: 2000,
          position: "top-center", // Position of the toast
          style: {
            background: "#341949",
            color: "#66FF00",
          },
        });
      }
    //   state.currentPlaylist = action.payload;
    //   state.playlistSongs = [...state.playlistSongs, action.payload.song];
      state.isLoadingForPlayL = false;
    });
    builder.addCase(postSongToPlaylist.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoadingForPlayL = false;
    });
  },
});

export default usePlaylistSlice;
