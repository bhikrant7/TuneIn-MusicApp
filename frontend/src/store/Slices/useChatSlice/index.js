// --- Create Slice First ---
import { axiosInstance } from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import socket from "@/lib/socket.js";


const useChatSlice = createSlice({
  name: "useChat",
  initialState: {
    users: [],
    adminUser: [],
    currentUserFromRedux: null,
    isLoading: false,
    error: null,
    // socket:null,
    // socket:socket,
    isConnected: false,
    onlineUsers: [],
    userActivities: {},
    messages: [],
    selectedUser: null,
  },
  reducers: {
    setSelectedUser:(state,action)=>{
      state.selectedUser = action.payload;
    },
    // Add this reducer
    // setSocket: (state, action) => {
    //   state.socket = action.payload;
    // },


    initSocketSuccess: (state) => {
      state.isConnected = true;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setUserActivities: (state, action) => {
      state.userActivities = action.payload;
    },
    userConnected: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userDisconnected: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    activityUpdated: (state, action) => {
      const { userId, activity } = action.payload;
      state.userActivities = {
        ...state.userActivities,
        [userId]: activity,
      };
    },
    disconnectSocket: (state) => {
      state.isConnected = false;
    },
  },
  extraReducers: (builder) => {
    //fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload.users
      state.adminUser = action.payload.adminUser;
      state.currentUserFromRedux = action.payload.currentUser;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Handle fetchMessages thunk
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });

    // Optionally, handle sendMessageThunk if you want to track its status:
    builder.addCase(sendMessageThunk.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const {
  initSocketSuccess,
  setOnlineUsers,
  setUserActivities,
  userConnected,
  userDisconnected,
  receiveMessage,
  activityUpdated,
  disconnectSocket,
  setSelectedUser,
  setSocket
} = useChatSlice.actions;

export default useChatSlice;

// --- Then Define Your Thunks ---


export const initSocketThunk = createAsyncThunk(
  "chat/initSocket",
  async (userId, { dispatch }) => {
    socket.auth = { userId };
    socket.connect();
    // Store socket in Redux state
    // dispatch(setSocket(socket));

    socket.emit("user_connected", userId);

    // Attach event listeners and dispatch actions on events:
    socket.on("users_online", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("activities", (activities) => {
      dispatch(setUserActivities(Object.fromEntries(activities)));
    });

    socket.on("user_connected", (userId) => {
      dispatch(userConnected(userId));
    });

    socket.on("user_disconnected", (userId) => {
      dispatch(userDisconnected(userId));
    });

    socket.on("receive_message", (message) => {
      dispatch(receiveMessage(message));
    });

    socket.on("message_sent", (message) => {
      dispatch(receiveMessage(message));
    });

    socket.on("activity_updated", ({ userId, activity }) => {
      dispatch(activityUpdated({ userId, activity }));
    });

    dispatch(initSocketSuccess());
    return true;
  }
);

export const disconnectSocketThunk = createAsyncThunk(
  "chat/disconnectSocket",
  async (_, { dispatch }) => { // Changed parameter to "_" to ignore the first argument
    socket.disconnect();
    dispatch(disconnectSocket());
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, senderId, content }, { rejectWithValue, dispatch }) => {
    try {
      if (!socket) {
        console.error("Socket is not connected");
        return rejectWithValue("No socket connection");
      }

      // Construct the message object
      const newMessage = {
        _id: Date.now().toString(), // Temporary unique ID
        senderId,
        receiverId,
        content,
        createdAt: new Date().toISOString(),
      };

      console.log("Sending message:", newMessage); // Debug log

      // // Optimistically update Redux state
      // dispatch(receiveMessage(newMessage));

      // Send message to the server
      socket.emit("send_message", newMessage, (response) => {
        console.log("Server Acknowledgment:", response);
      });

      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const fetchMessagesThunk = createAsyncThunk(
  "chat/fetchMessages",
  async (userId, { getState, rejectWithValue }) => {
    const { messages } = getState().useChat;

    // Prevent unnecessary API calls
    // if (messages.length > 0) {
    //   console.log("Skipping fetch, messages already loaded");
    //   return messages;
    // }

    console.log(`Fetching messages from API for ${userId} at ${new Date().toLocaleTimeString()}`);

    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUsers = createAsyncThunk(
  "fetchUsers",
  async (_, { rejectWithValue }) => { // Added "_" and destructured rejectWithValue
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

