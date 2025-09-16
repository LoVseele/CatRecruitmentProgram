import { createSlice } from "@reduxjs/toolkit";

// 定义用户在招新流程中所处的阶段
export type RecruitProcess =
  | "NOT_APPLIED"
  | "APPLIED"
  | "INTERVIEW_SCHEDULED"
  | "FINISHED";

export interface RecruitState {
  // 这个状态可以由一个API在应用启动时获取，由管理员在后台修改
  isRecruitingOpen: boolean;
  // 这个状态代表当前登录用户的个人进度
  userProcess: RecruitProcess;
}

const initialState: RecruitState = {
  isRecruitingOpen: true, // 默认为 true，建议后续通过API获取
  userProcess: "NOT_APPLIED",
};

const recruitSlice = createSlice({
  name: "recruit",
  initialState,
  reducers: {
    // 用于设置招新是否开启
    setRecruitingOpen: (state, action: { payload: boolean }) => {
      state.isRecruitingOpen = action.payload;
    },
    // 用于更新用户自己的进度
    setUserProcess: (state, action: { payload: RecruitProcess }) => {
      state.userProcess = action.payload;
    },
  },
});

export const { setRecruitingOpen, setUserProcess } = recruitSlice.actions;
export default recruitSlice.reducer;
