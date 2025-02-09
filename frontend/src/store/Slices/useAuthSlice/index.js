import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';
import { auth } from '@/config/firebase.config';

export const checkAdminStatus = createAsyncThunk('checkAdminStatus', async (_, { rejectWithValue }) => {
  try {
      let response = await axiosInstance.get('/admin/check');

      // 🚨 If token is expired, refresh the Firebase token and retry
      if (response.data.tokenExpired) {
          const user = auth.currentUser;
          if (user) {
              console.log("🔄 Refreshing token...");
              const newToken = await user.getIdToken(true); // Force refresh token
              axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
              
              // Retry the admin check
              response = await axiosInstance.get('/admin/check');
              console.log("Done checking for admin!");
          }
      }

      return response.data;
  } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to check admin status");
  }
});

const useAuthSlice = createSlice({
    name: 'useMyAuth',
    initialState:{
        isAdmin: false,
        isLoading: false,
        error: null,
    },
    reducers:{
      setAdminFalse:(state)=>{
        state.isAdmin = false;
      },
       setAdminTrue:(state)=>{
         state.isAdmin = true;
      }
    },
    extraReducers: (builder) => {
      builder.addCase(checkAdminStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(checkAdminStatus.fulfilled, (state, action) => {
        state.isAdmin = action.payload.success;
        state.isLoading = false;
      });
      builder.addCase(checkAdminStatus.rejected, (state, action) => {
        state.error = action.payload || "An error occurred";
        state.isLoading = false;
       });
    },
});

export default useAuthSlice;

export const {setAdminFalse, setAdminTrue } = useAuthSlice.actions;






