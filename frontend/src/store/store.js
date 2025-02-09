import { configureStore } from '@reduxjs/toolkit'
import useMusicSlice from './Slices/useMusicSlice/index.js'
import useChatSlice from './Slices/useChatSlice/index.js'
import useAuthSlice from './Slices/useAuthSlice/index.js'
import usePlayerSlice from './Slices/usePlayerSlice/index.js'
import usePlaylistSlice from './Slices/usePlaylistSlice/index.js'
import { socketMiddleware } from './Middleware/socketMiddleware.js'


export const store = configureStore({
  reducer: {useMusic:useMusicSlice.reducer,
    useChat:useChatSlice.reducer,
    useMyAuth:useAuthSlice.reducer,
    usePlayer:usePlayerSlice.reducer,
    usePlaylist: usePlaylistSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
})

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch