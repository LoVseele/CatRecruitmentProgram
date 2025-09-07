import { requestM2 } from '../utils/request';
import { AxiosHeaders } from 'axios';

// 获取预约数据接口
// 请求头参数类型（放 token）
interface GetAppointmentStateHeader {
    Authorization?: string;
}
// 返回参数
interface AppointmentStateResponse {
    code: number;
    message: string;
    data: null|string ;
}

export const getAppointmentState = (header?: GetAppointmentStateHeader) => {
    return requestM2.post<AppointmentStateResponse>(
        '/api/wx/interviews/getAppointmentState',
        {},
        {
            headers: header as AxiosHeaders
        }
    );
};

// 用户填写个人信息接口
interface UserApplyQueryParams {
    userName?: string;
    userNumber?: string;
    academy?: string;
    direction?: string;
    phone?: string;
    email?: string;
    selfIntroduction?: string;
}

interface UserApplyResponse {
    code: number;
    message: string;
    data: null;
}

export const userApply = (params: UserApplyQueryParams) => {
    return requestM2.post<UserApplyResponse>(
        '/api/wx/apply',
        {},
        {
            params: params // 传递 Query 参数
        }
    );
};