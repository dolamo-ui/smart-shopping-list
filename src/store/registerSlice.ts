import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Async thunk for checking if email exists and registering user
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (
    newUser: { email: string; password: string; name: string; cell: string },
    { rejectWithValue }
  ) => {
    try {
      // Check if email already exists
      const resCheck = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(newUser.email)}`); // ✅ Fixed template literal
      const existingUsers = await resCheck.json();
      
      if (existingUsers.length > 0) {
        return rejectWithValue('Email already registered');
      }

      // Register new user
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error('Failed to register');
      
      const userData = await res.json();
      return userData;
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

interface RegisterState {
  email: string;
  password: string;
  name: string;
  cell: string;
  error: string | null;
  success: boolean;
  loading: boolean;
}

const initialState: RegisterState = {
  email: '',
  password: '',
  name: '',
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
    setCell: (state, action: PayloadAction<string>) => {
      state.cell = action.payload;
    },
    resetRegister: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
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
        // Reset fields after successful registration
        state.email = '';
        state.password = '';
        state.name = '';
        state.cell = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Registration failed';
      });
  },
});

export const { setEmail, setPassword, setName, setCell, resetRegister, clearError } = registerSlice.actions;
export default registerSlice.reducer;