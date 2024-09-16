// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import profileSlice from "./profileSlice";
import schedulesSlice from "./schedulesSlice";

const isDevelompent = import.meta.env.MODE === "development";

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    schedules: schedulesSlice,
  },
  devTools: isDevelompent,
});
