// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";
import { userLogin, getSelfInfo, userApply } from "../api";
import type {
  User,
  LoginParams,
  UserInfoParams,
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
      return response.data;
    }
    return Promise.reject(new Error(response.message));
  }
);

export const fetchUserInfo = createAsyncThunk<User, UserInfoParams>(
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
        dispatch(fetchUserInfo({ openId: user.userInfo.openId }));
      }
    } else {
      return Promise.reject(new Error(response.message));
    }
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
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
