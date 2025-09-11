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

/** 把任意 headers-like 结构转成 plain object 且只保留原始 string 值 */
function normalizeHeadersToPlainObject(
  h?: Record<string, any> | unknown
): Record<string, string> {
  if (!h) return {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(h as Record<string, any>)) {
    const val = (h as Record<string, any>)[key];
    if (val === undefined || val === null) continue;
    // 跳过对象（例如 axios 的 common/get/post 子对象）
    if (typeof val === "object") continue;
    out[key] = typeof val === "string" ? val : String(val);
  }
  return out;
}

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      Taro.showLoading({ title: "加载中..." });

      // 1. 从 config.headers (可能包含 nested) 提取扁平键值
      const extracted = normalizeHeadersToPlainObject(
        (config.headers as any) ?? {}
      );

      // 2. 注入 token（如果存在）
      const token = Taro.getStorageSync("token");
      if (token) {
        extracted.Authorization = `Bearer ${token}`;
      }

      // 3. 构造最终的 plain object（保证值都是 string）
      const finalHeaders: Record<string, string> = {};
      for (const k of Object.keys(extracted)) {
        const v = extracted[k];
        if (v === undefined || v === null) continue;
        finalHeaders[k] = typeof v === "string" ? v : String(v);
      }

      // 4. 覆盖 axios 的 headers，并同时设置小程序风格的 header 字段（保险）
      (config as any).headers = Object.assign({}, finalHeaders);
      (config as any).header = Object.assign({}, finalHeaders); // mpAdapter / wx.request 可能读取 header

      // 5. 最后一步保险：为本次请求设置一个 wrapper adapter，
      //    确保传给 mpAdapter 的 config.header 一定是 plain object
      const originalAdapter = (config as any).adapter ?? mpAdapter;
      (config as any).adapter = (cfg: any) => {
        try {
          // 再次覆盖并 stringify/parse 做最后的去 prototype 操作
          const safeHeader = JSON.parse(
            JSON.stringify(cfg.header || cfg.headers || {})
          );
          cfg.header = safeHeader;
          // 删除可能的 nested 字段（防止 mpAdapter 内部读取）
          if (cfg.headers && typeof cfg.headers === "object") {
            // 保证没有 axios 样式的子对象
            for (const k of [
              "common",
              "get",
              "post",
              "put",
              "delete",
              "patch",
            ]) {
              if (cfg.headers[k]) delete cfg.headers[k];
            }
            cfg.headers = JSON.parse(JSON.stringify(cfg.headers));
          }
        } catch (e) {
          // ignore
        }
        // 调用原 adapter（通常是 mpAdapter）
        return (originalAdapter as any)(cfg);
      };

      // Debug 打印（运行后把这些 log 贴过来）
      // eslint-disable-next-line no-console
      console.log(
        "[REQUEST INTERCEPTOR] final headers keys:",
        Object.keys((config as any).headers)
      );
      // eslint-disable-next-line no-console
      console.log(
        "[REQUEST INTERCEPTOR] final headers sample:",
        (config as any).headers
      );
      // eslint-disable-next-line no-console
      console.log(
        "[REQUEST INTERCEPTOR] config.header typeof:",
        typeof (config as any).header,
        "toString:",
        Object.prototype.toString.call((config as any).header)
      );

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
      console.error("网络请求错误:", error);
      let errorMessage = "网络错误，请稍后重试";
      if (error.response) {
        errorMessage = `服务器错误: ${error.response.status}`;
        if (error.response.data && error.response.data.message) {
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
