// src/redux/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/players/profile`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.dataValues;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: {},
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setProfileData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setProfileData } = profileSlice.actions;

export default profileSlice.reducer;
