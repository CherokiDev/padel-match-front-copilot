// src/redux/schedulesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async (token, { rejecWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedules`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejecWithValue(error.response.data);
    }
  }
);
export const schedulesSlice = createSlice({
  name: "schedules",
  initialState: {
    data: {},
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSchedulesData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setSchedulesData } = schedulesSlice.actions;

export default schedulesSlice.reducer;
