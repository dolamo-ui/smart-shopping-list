import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  cell: string;
  profileImage?: string;
  joinDate?: string;
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
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    return data as ProfileState;
  }
);

// Thunk: update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, updatedData }: { userId: string; updatedData: Partial<ProfileState> }) => {
    const res = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const data = await res.json();
    return data as ProfileState;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state) => {
      Object.assign(state, initialState);
    },
    setProfileData: (state, action: PayloadAction<Partial<ProfileState>>) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetProfile, setProfileData } = profileSlice.actions;
export default profileSlice.reducer;