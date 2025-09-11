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
export const getAllInterviewTime = () => {
  return api.post<ApiResponse<InterviewTime[]>>(
    "/api/wx/interviews/getInterviewTime",
    null
  );
};

/*
 * @description 获取用户自己的信息
 */
export const getSelfInfo = (queryParams: UserInfoParams) => {
  return api.get<ApiResponse<User>>("/api/wx/getInformation", {
    params: queryParams,
  });
};

/*
 * @description 用户预约面试
 */
export const userAppointment = (queryParams?: AppointmentParams) => {
  return api.post<ApiResponse<null>>(
    "/api/wx/interviews/appointments",
    queryParams
  );
};

/*
 * @description 获取预约状态
 */
export const getAppointmentState = () => {
  return api.post<ApiResponse<string | null>>(
    "/api/wx/interviews/getAppointmentState",
    null
  );
};

/*
 * @description 用户填写个人信息
 */
export const userApply = (params: UserApplyParams) => {
  return api.post<ApiResponse<null>>("/api/wx/apply", params);
};
