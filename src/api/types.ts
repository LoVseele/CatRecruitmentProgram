// src/api/types.ts
/* 通用响应结构 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ===================================
// User 用户相关
// ===================================

/* 用户信息 */
export interface User {
  userId: string;
  openId: string;
  code: string | null;
  name: string | null;
  userNumber: string | null;
  academy: string | null;
  phoneNumber: string | null;
  email: string | null;
  userIntro: string | null;
  direction: string | null;
  state: string | null;
  role: string | null;
  username: string | null;
}

/* 登录接口 Query 参数 */
export interface LoginParams {
  code: string; // 临时登录凭证
}

/* 登录接口返回的数据结构 */
export interface LoginResponse {
  user: User;
  token: string;
  reFreshToken: string;
}

/* 用户个人信息接口 Query 参数 */
export interface UserInfoParams {
  openId: string;
}

/* 用户填写个人信息接口 Query 参数 */
export interface UserApplyParams {
  userName?: string;
  userNumber?: string;
  academy?: string;
  direction?: string;
  phone?: string;
  email?: string;
  selfIntroduction?: string;
}

// ===================================
// Interview 面试相关
// ===================================

/* 面试时间信息 */
export interface InterviewTime {
  id: number;
  accessType: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  appointedCount: string;
}

/* 用户预约接口 Query 参数 */
export interface AppointmentParams {
  appointmentId: number;
}

/* 取消预约接口 Body 参数 */
export interface CancelAppointmentParams {
  id: number;
  accessType: string;
}