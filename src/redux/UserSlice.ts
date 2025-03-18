import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk<User, string>(
  'user/fetchUserData',
  async (username) => {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export default userSlice.reducer;