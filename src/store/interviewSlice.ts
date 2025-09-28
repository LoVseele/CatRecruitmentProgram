// src/store/interviewSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInterviewTime,
  userAppointment,
  getAppointmentState,
  userCancelAppointment, // 1. 导入取消预约的 API 函数
} from "../api";
import type {
  InterviewTime,
  AppointmentParams,
  CancelAppointmentParams, // 2. 导入取消预约的参数类型
} from "../api/types";
import { AppDispatch } from ".";

export interface InterviewState {
  // 所有的预约时间段（初面、一面、二面都有）
  interviewTimes: InterviewTime[];
  // 用户当前预约的时间段id
  userAppointmentId: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InterviewState = {
  interviewTimes: [],
  userAppointmentId: null,
  status: "idle",
  error: null,
};

// 获取所有面试时间
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

// 预约面试
export const bookAppointment = createAsyncThunk<
  number | undefined,
  AppointmentParams,
  { dispatch: AppDispatch }
>("interview/book", async (params, { dispatch }) => {
  const response = await userAppointment(params);
  if (response.code === 200) {
    // 预约成功后，立即更新预约状态
    dispatch(fetchAppointmentState());
    return params.appointmentId;
  }
  return Promise.reject(new Error(response.message));
});

// 获取用户预约状态
export const fetchAppointmentState = createAsyncThunk<
  string | null,
  void,
  { dispatch: AppDispatch }
>("interview/fetchState", async (_, { dispatch }) => {
  const response = await getAppointmentState();
  console.log("预约状态", response);
  if (response.code === 200) {
    if (response.data) {
      dispatch(fetchInterviewTimes());
    }
    return response.data;
  }
  return Promise.reject(new Error(response.message));
});

// 取消预约
export const cancelAppointment = createAsyncThunk<
  void,
  CancelAppointmentParams,
  { dispatch: AppDispatch }
>("interview/cancel", async (params, { dispatch }) => {
  const response = await userCancelAppointment(params);
  if (response.code === 200) {
    // 取消成功后，清空本地的预约状态
    dispatch(fetchAppointmentState());
  } else {
    return Promise.reject(new Error(response.message));
  }
});

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
        state.interviewTimes = action.payload;
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
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(cancelAppointment.fulfilled, (state) => {
        state.status = "succeeded";
        // 取消成功后，将本地的预约ID置为null
        state.userAppointmentId = null;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "取消预约失败";
      });
  },
});

export default interviewSlice.reducer;
