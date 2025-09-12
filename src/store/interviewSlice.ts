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
    // 这里的 response 是完整的 AxiosResponse
    const response = await getAllInterviewTime();
    // 我们的业务数据在 response.data 中
    if (response.code === 200) {
      // thunk 成功时，返回业务数据中的 data 字段
      return response.data;
    }
    // thunk 失败时，拒绝并返回业务 message
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
        // 此处的 action.payload 现在是正确的 InterviewTime[] 类型
        state.times = action.payload;
      })
      .addCase(fetchInterviewTimes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "获取面试时间失败";
      })
      .addCase(fetchAppointmentState.fulfilled, (state, action) => {
        // 此处的 action.payload 现在是正确的 string | null 类型
        const appointmentId = action.payload;
        state.userAppointmentId =
          typeof appointmentId === "string"
            ? parseInt(appointmentId, 10)
            : appointmentId || null;
      });
  },
});

export default interviewSlice.reducer;
