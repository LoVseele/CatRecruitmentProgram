// src/api/index.ts

import { api } from "../utils/request";
import { AxiosHeaders } from "axios";
import type {
  LoginParams,
  LoginResponse,
  User,
  UserInfoParams,
  AppointmentParams,
  AuthHeader,
  ApiResponse,
  UserApplyParams,
  InterviewTime,
} from "./types";

/*
 * @description 用户登录
 * @param {LoginParams} queryParams - 请求参数
 * @param {AuthHeader} headerParams - 请求头
 */
export const userLogin = (
  queryParams: LoginParams,
  headerParams?: AuthHeader
) => {
  return api.get<ApiResponse<LoginResponse>>("/api/wx/login", {
    params: queryParams,
    headers: headerParams as AxiosHeaders,
  });
};

//获取所有面试时间

export const getAllInterviewTime = () => {
  return api.post<ApiResponse<InterviewTime[]>>(
    "/api/wx/interviews/getInterviewTime"
  );
};

/*
 * @description 获取用户自己的信息
 * @param {UserInfoParams} queryParams - 请求参数
 * @param {AuthHeader} headerParams - 请求头
 */
export const getSelfInfo = (
  queryParams: UserInfoParams,
  headerParams?: AuthHeader
) => {
  return api.get<ApiResponse<User>>("/api/wx/getInformation", {
    params: queryParams,
    headers: headerParams as AxiosHeaders,
  });
};

/*
 * @description 用户预约面试
 * @param {AppointmentParams} queryParams - 请求参数
 * @param {AuthHeader} headerParams - 请求头
 */
export const userAppointment = (
  queryParams?: AppointmentParams,
  headerParams?: AuthHeader
) => {
  return api.post<ApiResponse<null>>(
    "/api/wx/interviews/appointments",
    undefined,
    {
      params: queryParams,
      headers: headerParams as AxiosHeaders,
    }
  );
};

/*
 * @description 获取预约状态
 * @param {AuthHeader} header - 请求头
 */
export const getAppointmentState = (header?: AuthHeader) => {
  return api.post<ApiResponse<string | null>>(
    "/api/wx/interviews/getAppointmentState",
    {},
    {
      headers: header as AxiosHeaders,
    }
  );
};

/*
 * @description 用户填写个人信息
 * @param {UserApplyParams} params - 请求参数
 */
export const userApply = (params: UserApplyParams) => {
  return api.post<ApiResponse<null>>(
    "/api/wx/apply",
    {},
    {
      params: params,
    }
  );
};
