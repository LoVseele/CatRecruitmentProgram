// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";
import { userLogin, getSelfInfo, userApply } from "../api";
import type {
  User,
  LoginParams,
  UserApplyParams,
  LoginResponse,
} from "../api/types";
import type { RootState } from "./index";

export interface UserState {
  userInfo: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: Taro.getStorageSync("token") || null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<LoginResponse, LoginParams>(
  "user/login",
  async (params) => {
    const response = await userLogin(params);
    if (response.code === 200) {
      Taro.setStorageSync("token", response.data.token);
      Taro.setStorageSync("openId", response.data.user.openId);
      return response.data;
    }
    return Promise.reject(new Error(response.message));
  }
);

export const fetchUserInfo = createAsyncThunk<User, string>(
  "user/fetchInfo",
  async (params) => {
    const response = await getSelfInfo(params);
    if (response.code === 200) {
      return response.data;
    }
    return Promise.reject(new Error(response.message));
  }
);

export const applyInfo = createAsyncThunk<void, UserApplyParams>(
  "user/applyInfo",
  async (params, { dispatch, getState }) => {
    const response = await userApply(params);
    if (response.code === 200) {
      const { user } = getState() as RootState;
      if (user.userInfo?.openId) {
        // dispatch action to refetch user info
        dispatch(fetchUserInfo(user.userInfo.openId));
      }
    } else {
      return Promise.reject(new Error(response.message));
    }
  }
);

// 新增: 应用初始化时的认证逻辑
export const initializeAuth = createAsyncThunk<User | null, void>(
  "user/initializeAuth",
  async (_, { dispatch, getState }) => {
    const { user } = getState() as RootState;
    const token = Taro.getStorageSync("token");
    const openId = Taro.getStorageSync("openId");

    if (token && openId && !user.userInfo) {
      // 如果有 token 和 openId 但 Redux 中没有用户信息，则去获取
      try {
        const userInfo = await dispatch(fetchUserInfo(openId)).unwrap();
        return userInfo;
      } catch (error) {
        // 获取失败则清除 token
        Taro.removeStorageSync("token");
        Taro.removeStorageSync("openId");
        return null;
      }
    }
    return user.userInfo; // 如果已有用户信息，则直接返回
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.status = "idle";
      Taro.removeStorageSync("token");
      Taro.removeStorageSync("openId"); // 同时清除 openId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "登录失败";
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "获取用户信息失败";
      })
      // 新增: 处理 initializeAuth 的状态
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
