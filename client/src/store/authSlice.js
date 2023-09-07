import { createSlice } from "@reduxjs/toolkit";

const initialUser = JSON.parse(localStorage.getItem("userInfo"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser || null,
    isAuthenticated: !!initialUser,
  },
  reducers: {
    // Action to set the authentication status
    setAuthState: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state) => state.auth;

export default authSlice.reducer;
