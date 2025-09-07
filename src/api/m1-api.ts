import {requestM1} from '../utils/request'; 
import { AxiosHeaders } from 'axios';

//用户登录接口
// Query 参数类型
interface LoginQueryParams {
    code: string; // 临时登录凭证，必需
}

// Header 参数类型
interface LoginHeaderParams {
    Authorization?: string; 
}

interface LoginResponse {
    code: number;
    message: string;
    data: {
        user:{
            userId:string;
            openId:string;
            code:string|null;
            name:string|null;
            userNumber:string|null;
            academy:string|null;
            phoneNumber:string|null;
            email:string|null;
            userIntro: string | null;
            direction: string | null;
            state: string | null;
            role: string | null;
            username: string | null;
        };
        token: string; 
        reFreshToken: string;
    };
}

export const userLogin = (queryParams: LoginQueryParams, headerParams?: LoginHeaderParams) => {
    return requestM1.get<LoginResponse>('/api/wx/login', {
        params: queryParams,
        headers: headerParams as AxiosHeaders 
    });
};

// 用户获得全部面试时间接口
interface GetAllInterviewTimeResponse {
    code: number;
    message: string;
    data: {
        id:string;
        accessType: string;
        appointmentDate: string;
        startTime: string;
        endTime: string;
        capacity: string;
        appointedCount: string;
    };
}

export const getAllInterviewTime = () => {
    return requestM1.post<GetAllInterviewTimeResponse>('/api/wx/interviews/getInterviewTime');
};

// 用户获得自己的信息接口 
interface GetSelfInfoQueryParams {
    openId: string; 
}

// Header
interface GetSelfInfoHeaderParams {
    Authorization?: string; 
}

interface GetSelfInfoResponse {
    code: number;
    message: string;
    data: {
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
    };
}


export const getSelfInfo = (queryParams: GetSelfInfoQueryParams, headerParams?: GetSelfInfoHeaderParams) => {
    return requestM1.get<GetSelfInfoResponse>('/api/wx/getInformation', {
        params: queryParams,
        headers: headerParams as AxiosHeaders 
    });
};

// 用户预约接口
// Query 参数类型
interface UserAppointmentQueryParams {
    appointmentId?: number; 
}

// Header 参数类型
interface UserAppointmentHeaderParams {
    Authorization?: string; // token，可选
}

interface UserAppointmentResponse {
    code: number;
    message: string;
    data: null; 
}

export const userAppointment = (queryParams?: UserAppointmentQueryParams, headerParams?: UserAppointmentHeaderParams) => {
    return requestM1.post<UserAppointmentResponse>('/api/wx/interviews/appointments', undefined, {
        params: queryParams,
        headers: headerParams as AxiosHeaders
    });
};