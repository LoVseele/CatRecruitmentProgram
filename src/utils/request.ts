// src/utils/request.ts

import axios, { AxiosAdapter, AxiosInstance } from "axios";
import Taro from "@tarojs/taro";
import mpAdapter from "axios-miniprogram-adapter";

export const api: AxiosInstance = axios.create({
  baseURL: "http://47.101.189.231:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  adapter: mpAdapter as AxiosAdapter,
});

// 通用拦截器
const setupInterceptors = (instance: AxiosInstance) => {
  //请求拦截器
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

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      Taro.hideLoading();
      return response.data;
    },
    (error) => {
      Taro.hideLoading();

      // 打印详细的错误信息到控制台，方便调试
      console.error("网络请求错误:", error);

      let errorMessage = "网络错误，请稍后重试";
      if (error.response) {
        // 服务器返回了错误状态码
        errorMessage = `服务器错误: ${error.response.status}`;
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message; // 优先使用后端返回的错误消息
        }
      } else if (error.request) {
        errorMessage = "无法连接到服务器";
      }

      Taro.showToast({ title: errorMessage, icon: "none", duration: 2000 });

      return Promise.reject(error);
    }
  );
};

setupInterceptors(api);
