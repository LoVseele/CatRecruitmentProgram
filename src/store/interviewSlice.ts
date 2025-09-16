// src/store/interviewSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInterviewTime,
  userAppointment,
  getAppointmentState,
} from "../api";
import type { InterviewTime, AppointmentParams } from "../api/types";

export interface InterviewState {
  times: InterviewTime[];
  userAppointmentId: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InterviewState = {
  times: [],
  userAppointmentId: null,
  status: "idle",
  error: null,
};

export const fetchInterviewTimes = createAsyncThunk<InterviewTime[]>(
  "interview/fetchTimes",
  async () => {
    const response = await getAllInterviewTime();
    if (response.code === 200) {
      return response.data;
    }
    return Promise.reject(new Error(response.message));
  }
);

export const bookAppointment = createAsyncThunk<
  number | undefined,
  AppointmentParams
>("interview/book", async (params, { dispatch }) => {
  const response = await userAppointment(params);
  if (response.code === 200) {
    dispatch(fetchAppointmentState());
    return params.appointmentId;
  }
  return Promise.reject(new Error(response.message));
});

export const fetchAppointmentState = createAsyncThunk<string | null>(
  "interview/fetchState",
  async () => {
    const response = await getAppointmentState();
    if (response.code === 200) {
      return response.data;
    }
    return Promise.reject(new Error(response.message));
  }
);

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewTimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInterviewTimes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.times = action.payload;
      })
      .addCase(fetchInterviewTimes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "获取面试时间失败";
      })
      .addCase(fetchAppointmentState.fulfilled, (state, action) => {
        const appointmentId = action.payload;
        state.userAppointmentId =
          typeof appointmentId === "string"
            ? parseInt(appointmentId, 10)
            : appointmentId || null;
      });
  },
});

export default interviewSlice.reducer;
