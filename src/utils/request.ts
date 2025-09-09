import axios, { AxiosInstance } from "axios";
import Taro from "@tarojs/taro";

const BASE_DOMAIN = "http://127.0.0.1:4523";

//  m1 前缀的接口
export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_DOMAIN}/m1/7054402-6774545-default`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 通用拦截器
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      Taro.showLoading({ title: "加载中..." });
      const token = Taro.getStorageSync("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Taro.hideLoading();
      Taro.showToast({ title: "请求参数错误", icon: "none" });
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      Taro.hideLoading();
      return response.data;
    },
    (error) => {
      Taro.hideLoading();
      Taro.showToast({ title: "网络错误", icon: "none" });
      return Promise.reject(error);
    }
  );
};

setupInterceptors(api);
