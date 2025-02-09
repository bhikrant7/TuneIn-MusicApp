import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



const usePlayerSlice = createSlice({
  name: "usePlayer",
  initialState: {
    currentSong: null,
    isPlaying: false,
    isFav:false,
    queue: [],
    currentIndex: -1,
    isLoopAlbum: false,
    isLoopSong: false,
  },
  reducers: {
    setQueue: (state, action) => {
      state.queue = action.payload;

      if (action.payload && action.payload.length > 0) {
        state.currentSong = state.currentSong || action.payload[0];
        state.currentIndex = state.currentIndex === -1 && state.currentIndex;
      } else {
        state.currentSong = null;
        state.currentIndex = -1;
      }
    },

    playAlbum: (state, action) => {
      const Songs = action.payload.slice(0, -1);
      const startIndex = action.payload[action.payload.length - 1];
      
      if (Songs.length === 0) return;

      const song = Songs[startIndex];

      // console.log("Currentsong in here:",song)

      state.queue = Songs;
      state.currentSong = song;
      
      state.isPlaying = true;
      state.currentIndex = startIndex;
      //console.log("CurrentIndex in store:",state.currentIndex)

      // Reset looping states when a new album is played
      state.isLoopSong = false;
      state.isLoopAlbum = false;
    },

    setCurrentSong: (state, action) => {
      
      const song= action.payload;
      
      if (!song) return;

      // console.log("Currentsong in here:",song)
      


      const songIndex = state.queue.findIndex((qSong) => qSong.id === song.id);
      // console.log("Index here",songIndex)

      state.currentSong = song;
      state.isPlaying = true;
      state.currentIndex = songIndex !== -1 ? songIndex : state.currentIndex;
      // console.log("Currentsong in here:",state.currentIndex," ",state.currentSong)

      // Reset looping states when a new song is selected
      state.isLoopSong = false;
      state.isLoopAlbum = false;
    },

    togglePlay: (state) => {
      
      const willStartPlaying = !state.isPlaying;

      state.isPlaying = willStartPlaying; //just negate my state
    },

    setPlayFalse:(state) => {  //need to keep for playbackcontrol
      

      state.isPlaying = false; 
    },

    setPlayTrue:(state) => {  //need to keep for playbackcontrol
      

      state.isPlaying = true; 
    },

    playNext: (state) => {
      const { currentIndex, queue, isLoopAlbum, isLoopSong } = state;
    
      if (isLoopSong) {
        // If looping a song, replay the current song
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;

        //fix code
        if (typeof document !== "undefined") {
          const audio = document.querySelector("audio");
          if (audio) {
            audio.currentTime = 0; // Restart the song from the beginning
            audio.play();
          }
        }
      } else {
        const nextIndex = currentIndex + 1;
        if (nextIndex < queue.length) {
          // Move to next song
          state.currentSong = queue[nextIndex];
          state.currentIndex = nextIndex;
          state.isPlaying = true;




          //console.log("Currentsong in here:",queue[nextIndex])
        } else {
          if (isLoopAlbum) {
            // Restart album if loop is enabled
            state.currentSong = queue[0];
            state.currentIndex = 0;
            state.isPlaying = true;
          } else {
            // Stop playback when reaching the end
            state.isPlaying = false;
          }
        }
      }
    },
    

    playPrevious: (state) => {
      const { currentIndex, queue, isLoopSong } = state;
    
      if (isLoopSong) {
        // If looping a song, replay the current song
        state.currentSong = queue[currentIndex];
        state.isPlaying = true;
      } else {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          state.currentSong = queue[prevIndex];
          state.currentIndex = prevIndex;
          state.isPlaying = true;



          //console.log("Currentsong in here:",queue[prevIndex])
        } else {
          // No previous song
          state.isPlaying = false;
        }
      }
    },

    //favourite song
    setisFav:(state,action) =>{
      state.isFav = action.payload;
    },
    

    //for loop
    setLoopForAlbum: (state) => {
      state.isLoopAlbum = true;
    },

    resetLoopForAlbum: (state) => {
      state.isLoopAlbum = false;
    },

    setLoopForSong: (state) => {
      state.isLoopSong = true;
    },

    resetLoopForSong: (state) => {
      state.isLoopSong = false;
    },
  },
});

export default usePlayerSlice;
export const {
  playAlbum,
  setQueue,
  togglePlay,
  setCurrentSong,
  playNext,
  setPlayFalse,
  setPlayTrue,
  playPrevious,
  setLoopForAlbum,
  resetLoopForAlbum,
  setLoopForSong,
  resetLoopForSong,
  setisFav
} = usePlayerSlice.actions;
