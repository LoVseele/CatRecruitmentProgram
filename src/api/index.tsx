import { api } from "../utils/request";
import type {
  LoginParams,
  LoginResponse,
  User,
  AppointmentParams,
  ApiResponse,
  UserApplyParams,
  InterviewTime,
} from "./types";

/*用户登录*/
export const userLogin = (
  params: LoginParams
): Promise<ApiResponse<LoginResponse>> => {
  return api.get("/api/wx/login", { params });
};

/*获取所有面试时间*/
export const getAllInterviewTime = (): Promise<
  ApiResponse<InterviewTime[]>
> => {
  return api.get("/api/wx/interviews/getInterviewTime");
};

/*获取用户自己的信息*/
export const getSelfInfo = (
  openId: string
): Promise<ApiResponse<User>> => {
  return api.get("/api/wx/getInformation", {
    params: { openId: openId } // 关键：用对象包裹参数，key 为后端约定的参数名（这里是 openId）
  });
};
/*用户预约面试*/
export const userAppointment = (
  queryParams?: AppointmentParams
): Promise<ApiResponse<null>> => {
  return api.post("/api/wx/interviews/appointments", queryParams);
};

/*获取预约状态*/
export const getAppointmentState = (): Promise<ApiResponse<string | null>> => {
  return api.post("/api/wx/interviews/getAppointmentState", null);
};

/*用户填写个人信息*/
export const userApply = (
  params: UserApplyParams
): Promise<ApiResponse<null>> => {
  return api.post("/api/wx/apply", params);
};
