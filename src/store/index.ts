// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import interviewReducer from "./interviewSlice";
import recruitReducer from "./recruitSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    interview: interviewReducer,
    recruit: recruitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
