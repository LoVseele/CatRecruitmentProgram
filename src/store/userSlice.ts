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
    // 这里的 response 是完整的 AxiosResponse
    const response = await userLogin(params);
    // 我们的业务数据在 response.data 中
    if (response.data.code === 0) {
      Taro.setStorageSync("token", response.data.data.token);
      // thunk 成功时，返回业务数据中的 data 字段
      return response.data.data;
    }
    // thunk 失败时，拒绝并返回业务 message
    return Promise.reject(new Error(response.data.message));
  }
);

export const fetchUserInfo = createAsyncThunk<User, UserInfoParams>(
  "user/fetchInfo",
  async (params) => {
    const response = await getSelfInfo(params);
    if (response.data.code === 0) {
      return response.data.data;
    }
    return Promise.reject(new Error(response.data.message));
  }
);

export const applyInfo = createAsyncThunk<void, UserApplyParams>(
  "user/applyInfo",
  async (params, { dispatch, getState }) => {
    const response = await userApply(params);
    if (response.data.code === 0) {
      const { user } = getState() as RootState;
      if (user.userInfo?.openId) {
        // dispatch action to refetch user info
        dispatch(fetchUserInfo({ openId: user.userInfo.openId }));
      }
    } else {
      return Promise.reject(new Error(response.data.message));
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
