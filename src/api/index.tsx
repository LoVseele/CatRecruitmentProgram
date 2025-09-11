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
 */
/** 将可能的 header 值规范成普通对象 { [k: string]: string } */
function normalizeHeaders(h?: AuthHeader): Record<string, string> {
  if (!h) return {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(h as Record<string, any>)) {
    const val = (h as Record<string, any>)[key];
    if (val === undefined || val === null) continue;
    out[key] = typeof val === "string" ? val : String(val);
  }
  return out;
}

export const userLogin = (
  params: LoginParams,
  headerParams?: AuthHeader
): Promise<ApiResponse<LoginResponse>> => {
  return api.get("/api/wx/login", {
    params,
    headers: normalizeHeaders(headerParams),
  });
};

//获取所有面试时间
export const getAllInterviewTime = (headerParams?: AuthHeader) => {
  return api.post<ApiResponse<InterviewTime[]>>(
    "/api/wx/interviews/getInterviewTime",
    {},
    { headers: (headerParams as AxiosHeaders) ?? {} }
  );
};

/*
 * @description 获取用户自己的信息
 * @param {UserInfoParams} queryParams - 请求参数
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
 */
export const userAppointment = (
  queryParams?: AppointmentParams,
  headerParams?: AuthHeader
) => {
  return api.post<ApiResponse<null>>(
    "/api/wx/interviews/appointments",
    queryParams, // data 放这里
    {
      headers: (headerParams as AxiosHeaders) || {},
    }
  );
};

/*
 * @description 获取预约状态
 */
export const getAppointmentState = (headerParams?: AuthHeader) => {
  return api.post<ApiResponse<string | null>>(
    "/api/wx/interviews/getAppointmentState",
    {},
    {
      headers: headerParams as AxiosHeaders,
    }
  );
};

/*
 * @description 用户填写个人信息
 * @param {UserApplyParams} params - 请求参数
 */
export const userApply = (
  params: UserApplyParams,
  headerParams?: AuthHeader
) => {
  return api.post<ApiResponse<null>>(
    "/api/wx/apply",
    params, // data
    {
      headers: (headerParams as AxiosHeaders) || {},
    }
  );
};
