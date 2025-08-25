import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // ✅ type-only import

// Async thunk for API integration (optional)
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (newUser: { email: string; password: string; name: string; surname: string; cell: string }) => {
    const res = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error('Failed to register');
    return res.json();
  }
);

interface RegisterState {
  email: string;
  password: string;
  name: string;
  surname: string;
  cell: string;
  error: string | null;
  success: boolean;
  loading: boolean;
}

const initialState: RegisterState = {
  email: '',
  password: '',
  name: '',
  surname: '',
  cell: '',
  error: null,
  success: false,
  loading: false,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setSurname: (state, action: PayloadAction<string>) => {
      state.surname = action.payload;
    },
    setCell: (state, action: PayloadAction<string>) => {
      state.cell = action.payload;
    },
    resetRegister: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // reset fields
        state.email = '';
        state.password = '';
        state.name = '';
        state.surname = '';
        state.cell = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { setEmail, setPassword, setName, setSurname, setCell, resetRegister } = registerSlice.actions;

export default registerSlice.reducer;
