// src/api/index.ts

import { api } from "../utils/request";
import type {
  LoginParams,
  LoginResponse,
  User,
  UserInfoParams,
  AppointmentParams,
  ApiResponse,
  UserApplyParams,
  InterviewTime,
} from "./types";

/*
 * @description 用户登录
 */
export const userLogin = (
  params: LoginParams
): Promise<ApiResponse<LoginResponse>> => {
  return api.get("/api/wx/login", { params });
};

/*
 * @description 获取所有面试时间
 */
export const getAllInterviewTime = (): Promise<
  ApiResponse<InterviewTime[]>
> => {
  return api.get("/api/wx/interviews/getInterviewTime");
};

/*
 * @description 获取用户自己的信息
 */
export const getSelfInfo = (
  openId: string
): Promise<ApiResponse<User>> => {
  return api.get("/api/wx/getInformation", {
    params: { openId: openId } // 关键：用对象包裹参数，key 为后端约定的参数名（这里是 openId）
    // 简化写法（当参数名和变量名相同时）：params: { openId }
  });
};
/*
 * @description 用户预约面试
 */
export const userAppointment = (
  queryParams?: AppointmentParams
): Promise<ApiResponse<null>> => {
  return api.post("/api/wx/interviews/appointments", queryParams);
};

/*
 * @description 获取预约状态
 */
export const getAppointmentState = (): Promise<ApiResponse<string | null>> => {
  return api.post("/api/wx/interviews/getAppointmentState", null);
};

/*
 * @description 用户填写个人信息
 */
export const userApply = (
  params: UserApplyParams
): Promise<ApiResponse<null>> => {
  return api.post("/api/wx/apply", params);
};
