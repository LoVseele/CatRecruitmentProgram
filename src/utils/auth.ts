import Taro from "@tarojs/taro";

const TOKEN_KEY = "authToken";

/*
 * 将 Token 保存到本地存储
 * @param token 从服务器获取的 Token
 */
export const setToken = (token: string) => {
  Taro.setStorageSync(TOKEN_KEY, token);
};

/*
 * 从本地存储中获取 Token
 * @returns {string | null}
 */
export const getToken = (): string | null => {
  return Taro.getStorageSync(TOKEN_KEY);
};

/*
 * 从本地存储中移除 Token
 */
export const removeToken = () => {
  Taro.removeStorageSync(TOKEN_KEY);
};

/*
 * 检查用户是否已登录
 * @returns {boolean}
 */
export const isLogin = (): boolean => {
  return !!getToken();
};
