import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
}

interface LoginState {
  email: string;
  password: string;
  error?: string;
  user?: User;
}

const initialState: LoginState = {
  email: "",
  password: "",
  error: undefined,
  user: undefined,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = undefined;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.user = undefined;
    },
    logout: (state) => {
      state.user = undefined;
      state.email = "";
      state.password = "";
      state.error = undefined;
    },
  },
});

export const { setEmail, setPassword, loginSuccess, loginFailure, logout } =
  loginSlice.actions;
export default loginSlice.reducer;
