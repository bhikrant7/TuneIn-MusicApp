import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchAlbums = createAsyncThunk("fetchAlbums", async () => {
  const response = await axiosInstance.get("/albums");
  return response.data;
});

export const fetchAlbumById = createAsyncThunk("fetchAlbumById", async (id) => {
  const response = await axiosInstance.get(`/albums/${id}`);
  return response.data;
});

//albums to be displayed with tags
export const fetchGenreAlbums = createAsyncThunk(
  "fetchGenreAlbums",
  async () => {
    try {
      const response = await axiosInstance.get(`/albums/tags`);
      return response.data;
    } catch (error) {
      return console.error("Error in fetch Genre Albums", error);
    }
  }
);

//songs to be displayed or total server songs
export const fetchSongs = createAsyncThunk("fetchSongs", async () => {
  const response = await axiosInstance.get("/songs/");
  return response.data;
});

export const fetchSongById = createAsyncThunk("fetchSongById", async (id) => {
  const response = await axiosInstance.get(`/songs/${id}`);
  return response.data;
});

//featured songs
export const fetchFeaturedSongs = createAsyncThunk(
  "fetchFeaturedSongs",
  async () => {
    const response = await axiosInstance.get("/songs/featured");
    return response.data;
  }
);
//trending songs
export const fetchTrendingSongs = createAsyncThunk(
  "fetchTrendingSongs",
  async () => {
    const response = await axiosInstance.get("/songs/trending");
    return response.data;
  }
);

//made for You songs
export const fetchMadeForYouSongs = createAsyncThunk(
  "fetchMadeForYouSongs",
  async () => {
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      //console.log("Response from server",response.data)
      return response.data;
    } catch (error) {
      return console.error("Error in fetching songs", error);
    }
  }
);

//recently played songs particular to user
export const fetchRecentlyPlayedSongs = createAsyncThunk(
  "fetchRecentlyPlayedSongs",
  async () => {
    const response = await axiosInstance.get("/songs/recently-played");
    return response.data;
  }
);

//Post the recently played song
export const postRecentlyPlayedSong = createAsyncThunk(
  "postRecentlyPlayedSong",
  async (id) => {
    const response = await axiosInstance.post(`/songs/recently-played/${id}`);
    return response.data;
  }
);

//post fav songs
export const postFavSong = createAsyncThunk(
  "postFavSong",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        console.error("Error: No song ID provided!");
        return rejectWithValue("No song ID provided.");
      }

      console.log("Sending POST request to:", `/fav-songs/${id}`);

      const response = await axiosInstance.post(`/songs/fav-songs/${id}`);
      console.log("Received response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error in postFavSong:", error);
      return rejectWithValue(
        error.response?.data.error || "Failed to update song to fav list"
      );
    }
  }
);

//fetch fav songs
export const fetchFavSongs = createAsyncThunk(
  "fetchFavSongs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/songs/fav-songs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error || "Failed to fetch fav songs"
      );
    }
  }
);

//update play stats
export const updatePlayCount = createAsyncThunk(
  "updatePlayCount",
  async (songId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/stats/play/${songId}`);
      return response.data; // Return updated song data
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error || "Error updating play count"
      );
    }
  }
);

//update fav stats
export const updateFavCount = createAsyncThunk(
  "updateFavCount",
  async (songId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/stats/fav/${songId}`);
      return response.data; // Return updated song data
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error || "Error updating play count"
      );
    }
  }
);

//fetch Stats
export const fetchStats = createAsyncThunk(
  "fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/stats/");
      return response.data; // Return trending songs list
    } catch (error) {
      return rejectWithValue(error.response?.data.error || "Error fetching Stats");
    }
  }
);

//fetch User Stats
export const fetchUserMonthlyStats = createAsyncThunk(
  "fetchUserMonthlyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/stats/user/");
      console.log(response.data);
      return response.data; // Return trending songs list
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error || "Error fetching User Stats"
      );
    }
  }
);

//deletesong
export const deleteSong = createAsyncThunk(
  "deleteSong",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/admin/songs/${id}`);

      
      return response.data;
    } catch (error) {
      

      return rejectWithValue(error.response?.data.error || "Error Deleting Song");
    }
  }
);


//DELETEAlbum
export const deleteAlbum = createAsyncThunk("deleteAlbum",async(id ,{ rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/admin/albums/${id}`);

    
    return response.data;
  } catch (error) {
    

    return rejectWithValue(error.response?.data.error || "Error Deleting Song");
  }
}
);


const useMusicSlice = createSlice({
  name: "useMusic",
  initialState: {
    albums: [],
    songs: [],
    displaySongs: [],
    isLoading: false,
    isLoadingForMutexReload: false,
    error: null,
    currentAlbum: null,
    searchIdCurrentSong: null,

    FeaturedSongs: [],
    TrendingSongs: [],
    RecentlyPlayedSongs: [],
    MadeForYouSongs: [],
    FavSongs: [],

    //stats
    stats: {
      totalSongs: 0,
      totalAlbums: 0,
      totalUsers: 0,
      totalArtists: 0,
      totalPlays: 0,
      weeklyPlays: 0,
      totalGenres: 0,
      dailyPlays: [],
      totalUniqueUsers: 0, // ✅ New field to track unique users
    },

    userStats: [],

    isStatLoading: null,
    isUserStatLoading: null,

    //moods or genre albums
    genreAlbums: [],

    //search
    searchResults: [],
    searchFoundBool: false,
    searchAskedBool: false,
  },
  reducers: {
    // Action to randomly select 30 songs from the songs array
    setRandomDisplaySongs: (state) => {
      state.isLoading = true;
      const shuffledSongs = [...state.songs].sort(() => 0.5 - Math.random());
      state.displaySongs = shuffledSongs.slice(0, 30);
      state.isLoading = false;
    },
    searchMusic: (state, action) => {
      const query = action.payload.toLowerCase().replace(/\s+/g, ""); // Remove spaces
      state.searchFoundBool = false; // Reset search state
      state.searchAskedBool = true; // Mark that a search was performed

      state.searchResults = [
        ...state.songs.filter(
          (song) =>
            song.title.toLowerCase().replace(/\s+/g, "").includes(query) ||
            song.artist.toLowerCase().replace(/\s+/g, "").includes(query)
        ),
        ...state.albums.filter((album) =>
          album.title.toLowerCase().replace(/\s+/g, "").includes(query)
        ),
      ];

      state.searchFoundBool = state.searchResults.length > 0; // Set true if results exist
    },
    setSearchAsk: (state, action) => {
      state.searchAskedBool = action.payload;
    },
  },
  extraReducers: (builder) => {
    //for fetchAlbums
    builder.addCase(fetchAlbums.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAlbums.fulfilled, (state, action) => {
      state.isLoading = false;
      state.albums = action.payload;
    });
    builder.addCase(fetchAlbums.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //for fetchAlbumById
    builder.addCase(fetchAlbumById.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchAlbumById.fulfilled, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.currentAlbum = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAlbumById.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    //for fetchGenreAlbums
    builder.addCase(fetchGenreAlbums.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchGenreAlbums.fulfilled, (state, action) => {
     // console.log("Fetched genre albums:", action.payload); // Debug response
      state.isLoadingForMutexReload = false;
      state.genreAlbums = action.payload;
      state.error = null;
    });
    builder.addCase(fetchGenreAlbums.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    // for fetchSongs
    builder.addCase(fetchSongs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;

      // ✅ Map structure ensures unique songs, maintains order, and keys can be of any type.
      const shuffledSongMap = new Map();

      action.payload.forEach((song) => {
        const key = `${song.title}-${song.artist}`; // Unique identifier for each song

        // ✅ Prefer album version if available
        // If the song is not in the map OR if an album version is missing, store the album version.
        if (!shuffledSongMap.has(key) || !shuffledSongMap.get(key).albumId) {
          shuffledSongMap.set(key, { ...song, albumId: song.albumId }); // Accept only the album version
        }
      });

      // ✅ Convert map values to an array & filter out invalid objects
      const shuffledSongs = [...shuffledSongMap.values()].filter(
        (song) => song && song._id
      );

      // ✅ Store the final list of songs
      state.songs = shuffledSongs;
      // console.log("Total songs ", state.songs.length);

      // ✅ Automatically set random display songs when songs are fetched
      // Randomly shuffle and pick 30 songs for display
      state.displaySongs = [...shuffledSongs]
        .sort(() => 0.5 - Math.random())
        .slice(0, 30);
    });

    builder.addCase(fetchSongs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //for fetchSongById
    builder.addCase(fetchSongById.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchSongById.fulfilled, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.searchIdCurrentSong = action.payload;
      state.error = null;
    });
    builder.addCase(fetchSongById.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    // for fetchFeaturedSongs
    builder.addCase(fetchFeaturedSongs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFeaturedSongs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.FeaturedSongs = action.payload;
    });
    builder.addCase(fetchFeaturedSongs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // for fetchTrendingSongs
    builder.addCase(fetchTrendingSongs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTrendingSongs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.TrendingSongs = action.payload;
    });
    builder.addCase(fetchTrendingSongs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //I will use a separate loading bool to prevent unnecessary load

    // for fetchRecentlyPlayedSongs
    builder.addCase(fetchRecentlyPlayedSongs.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchRecentlyPlayedSongs.fulfilled, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.RecentlyPlayedSongs = action.payload;
      //state.RecentlyPlayedSongs.unshift(action.payload); //to immideatly showcase the recently played in ui
    });
    builder.addCase(fetchRecentlyPlayedSongs.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    // for fetchMadeForYouSongs
    builder.addCase(fetchMadeForYouSongs.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchMadeForYouSongs.fulfilled, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.MadeForYouSongs = action.payload;
    });
    builder.addCase(fetchMadeForYouSongs.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    // for fetchFavSongs
    builder.addCase(fetchFavSongs.pending, (state) => {
      state.isLoadingForMutexReload = true;
      state.error = null;
    });
    builder.addCase(fetchFavSongs.fulfilled, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.FavSongs = action.payload;
    });
    builder.addCase(fetchFavSongs.rejected, (state, action) => {
      state.isLoadingForMutexReload = false;
      state.error = action.error.message;
    });

    //fetchStats
    builder.addCase(fetchStats.pending, (state) => {
      state.isStatLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.isStatLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchStats.rejected, (state, action) => {
      state.isStatLoading = false;
      state.error = action.error.message;
    });


    builder
      // User Monthly Stats
      .addCase(fetchUserMonthlyStats.pending, (state) => {
        state.isUserStatLoading = true;
      })
      .addCase(fetchUserMonthlyStats.fulfilled, (state, action) => {
        state.isUserStatLoading = false;
        state.userStats = action.payload; // Store fetched user stats
        // console.log(action.payload);
      })
      .addCase(fetchUserMonthlyStats.rejected, (state, action) => {
        state.isUserStatLoading = false;
        state.error = action.payload;
      });


      builder
      //deleteSong
        .addCase(deleteSong.fulfilled,(state,action)=>{
          state.songs = state.songs.filter((song)=>{
            song._id !== action.payload.songId
          })
          toast.success("Song deleted successfully! 🎉", {
            duration: 4000, // How long the toast stays (in ms)
            position: "top-center", // Position of the toast
            style: {
              background: "#341949",
              color: "#66FF00",
            },
          });
        })
        .addCase(deleteSong.rejected,(state,action)=>{
          state.error = action.payload;
          toast.error("Song deletion failed!", {
            duration: 4000, // How long the toast stays (in ms)
            position: "top-center", // Position of the toast
            style: {
              background: "#341949",
              color: "#FF0000",
            },
          });
        });

      builder
      //deleteAlbum
        .addCase(deleteAlbum.fulfilled,(state,action)=>{
          state.albums = state.albums.filter((album)=>album._id !== action.payload?.albumId );
          state.songs = state.songs.map((song) => {
            if (song.albumId === action.payload?.albumId) {
              return { ...song, albumId: null };
            }
            return song;
          });
          toast.success("Album deleted successfully! 🎉", {
            duration: 4000, // How long the toast stays (in ms)
            position: "top-center", // Position of the toast
            style: {
              background: "#341949",
              color: "#66FF00",
            },
          });

        })
        .addCase(deleteAlbum.rejected,(state,action)=>{
          state.error = action.payload;
          toast.error("Album deletion failed!", {
            duration: 4000, // How long the toast stays (in ms)
            position: "top-center", // Position of the toast
            style: {
              background: "#341949",
              color: "#FF0000",
            },
          });
        });


  },
});

export const {
  setRandomDisplaySongs,
  // loadMoreRandomSongs,
  searchMusic,
  setSearchAsk,
} = useMusicSlice.actions;

export default useMusicSlice;
