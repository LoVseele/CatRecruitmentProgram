import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInterviewTime,
  userAppointment,
  getAppointmentState,
  userCancelAppointment,
} from "../api";
import type {
  InterviewTime,
  AppointmentParams,
  CancelAppointmentParams,
} from "../api/types";
import { AppDispatch, RootState } from ".";
import { fetchUserInfo } from "./userSlice";

export interface InterviewState {
  interviewTimes: InterviewTime[];
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
  { dispatch: AppDispatch; state: RootState }
>("interview/book", async (params, { dispatch, getState }) => {
  // 3. 从 thunkAPI 中解构出 getState
  const response = await userAppointment(params);
  if (response.code === 200) {
    // 预约成功后，立即更新预约状态
    dispatch(fetchAppointmentState());

    // 重新获取用户信息以更新状态
    const { user } = getState();
    if (user.userInfo?.openId) {
      dispatch(fetchUserInfo(user.userInfo.openId));
    }

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
  { dispatch: AppDispatch; state: RootState }
>("interview/cancel", async (params, { dispatch, getState }) => {
  const response = await userCancelAppointment(params);
  if (response.code === 200) {
    dispatch(fetchAppointmentState());

    // 重新获取用户信息以更新状态
    const { user } = getState();
    if (user.userInfo?.openId) {
      dispatch(fetchUserInfo(user.userInfo.openId));
    }
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
        state.userAppointmentId = null;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "取消预约失败";
      });
  },
});

export default interviewSlice.reducer;
