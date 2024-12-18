import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Load initial state from localStorage
const persistedAuthData = JSON.parse(localStorage.getItem("authData")) || {};
 const baseUrl = process.env.REACT_APP_BASE_URL;
 
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/account/login/`,
        { email, password }
      );
      console.log("Login Successful:", response.data);
      return response.data; // Assuming response includes access, refresh, etc.
    } catch (error) {
      console.error("Login Failed:", error.response || error);
      return rejectWithValue(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    access: persistedAuthData.access || null,
    refresh: persistedAuthData.refresh || null,
    name: persistedAuthData.name || null,
    user_id: persistedAuthData.user_id || null,
    email: persistedAuthData.email || null,
    broadcast_token: persistedAuthData.broadcast_token || null,
    broadcast_userid: persistedAuthData.broadcast_userid || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      // Reset user data and error
      state.access = null;
      state.refresh = null;
      state.name = null;
      state.user_id = null;
      state.email = null;
      state.broadcast_token = null;
      state.broadcast_userid = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("authData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.name = action.payload.name;
        state.user_id = action.payload.user_id;
        state.email = action.payload.email;
        state.broadcast_token = action.payload.broadcast_token;
        state.broadcast_userid = action.payload.broadcast_userid;

        // Persist data in localStorage
        localStorage.setItem(
          "authData",
          JSON.stringify({
            access: action.payload.access,
            refresh: action.payload.refresh,
            name: action.payload.name,
            user_id: action.payload.user_id,
            email: action.payload.email,
            broadcast_token: action.payload.broadcast_token,
            broadcast_userid: action.payload.broadcast_userid,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
