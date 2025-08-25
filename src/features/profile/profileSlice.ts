import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // ✅ type-only import

interface ProfileState {
  id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: ProfileState = {
  name: '',
  surname: '',
  email: '',
  password: '',
  cell: '',
  status: 'idle',
};

// Thunk: fetch profile by userId
export const fetchProfile = createAsyncThunk<ProfileState, string>(
  'profile/fetchProfile',
  async (userId) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return (await res.json()) as ProfileState;
  }
);

// Thunk: update profile
export const updateProfile = createAsyncThunk<
  ProfileState,
  { userId: string; updatedData: Partial<ProfileState> }
>(
  'profile/updateProfile',
  async ({ userId, updatedData }) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return (await res.json()) as ProfileState;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileState>) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<ProfileState>) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
