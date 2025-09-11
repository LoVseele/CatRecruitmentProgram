// src/utils/request.ts
import axios, { AxiosAdapter, AxiosInstance } from "axios";
import Taro from "@tarojs/taro";
import mpAdapter from "axios-miniprogram-adapter";

// ----------- 工具函数 -------------
// 保证对象是最原始的 PlainObject（去掉 Proxy / 原型 / axios 内部结构）
function ensurePlainObject(obj: any): Record<string, string> {
  return JSON.parse(JSON.stringify(obj ?? {}));
}

// ----------- axios 实例 -------------
export const api: AxiosInstance = axios.create({
  baseURL: "http://47.101.189.231:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  adapter: mpAdapter as AxiosAdapter,
});

// ----------- 拦截器设置 -------------
const setupInterceptors = (instance: AxiosInstance) => {
  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      Taro.showLoading({ title: "加载中..." });

      // 注入 token
      const token = Taro.getStorageSync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 重写 adapter，确保传给 mpAdapter 的 header 一定是 PlainObject
      const originalAdapter = (config as any).adapter ?? mpAdapter;
      (config as any).adapter = (cfg: any) => {
        cfg.headers = ensurePlainObject(cfg.headers);
        cfg.header = ensurePlainObject(cfg.header);
        return (originalAdapter as any)(cfg);
      };

      // Debug 输出
      console.log("[REQUEST] headers:", (config as any).headers);

      return config;
    },
    (error) => {
      Taro.hideLoading();
      Taro.showToast({ title: "请求参数错误", icon: "none" });
      return Promise.reject(error);
    }
  );

  // 响应拦截
  instance.interceptors.response.use(
    (response) => {
      Taro.hideLoading();
      return response.data;
    },
    (error) => {
      Taro.hideLoading();
      console.error("网络请求错误:", error);

      let errorMessage = "网络错误，请稍后重试";
      if (error.response) {
        errorMessage = `服务器错误: ${error.response.status}`;
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
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
