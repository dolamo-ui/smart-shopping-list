import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
  profileImage?: string;  // ✅ Added
  joinDate?: string;      // ✅ Added
}

interface LoginState {
  email: string;
  password: string;
  error?: string;
  user?: User;
  isAuthenticated: boolean;
}

const initialState: LoginState = {
  email: "",
  password: "",
  error: undefined,
  user: undefined,
  isAuthenticated: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      // Clear error when user starts typing
      if (state.error) {
        state.error = undefined;
      }
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      // Clear error when user starts typing
      if (state.error) {
        state.error = undefined;
      }
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = undefined;
      // Clear password for security
      state.password = "";
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.user = undefined;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = undefined;
      state.email = "";
      state.password = "";
      state.error = undefined;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  setEmail, 
  setPassword, 
  loginSuccess, 
  loginFailure, 
  logout,
  clearError,
  updateUser  // ✅ Export new action
} = loginSlice.actions;

export default loginSlice.reducer;