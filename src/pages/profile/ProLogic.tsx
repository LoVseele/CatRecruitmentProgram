import { FC, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import ProView from "./Profile"; // 引入视图组件
import LoginModal from "../../components/LoginModal"; // 引入登录弹窗
import { isLogin, removeToken } from "../../utils/auth"; // 引入认证工具

// 逻辑组件，处理所有业务逻辑
const ProLogic: FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  // 使用 useEffect 在组件加载时检查一次登录状态
  useEffect(() => {
    setLoggedIn(isLogin());
  }, []);

  // --- 事件处理函数 ---

  // 点击登录按钮时，显示弹窗
  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  // 成功登录后的回调
  const handleLoginSuccess = () => {
    setLoggedIn(true);
    // 这里可以根据需要添加获取用户信息的逻辑
  };

  // 点击退出登录
  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    Taro.showToast({
      title: "已退出登录",
      icon: "success",
    });
  };

  // --- 页面跳转逻辑 (保持不变) ---
  const handleGoToRegistration = () => {
    Taro.navigateTo({
      url: "/pages/profile/registration/registration",
    }).catch((err) => {
      console.error("跳转报名信息失败:", err);
    });
  };

  const handleGoToNotifications = () => {
    Taro.navigateTo({
      url: "/pages/profile/notifications/notifications",
    }).catch((err) => {
      console.error("跳转我的通知失败:", err);
    });
  };

  const handleGoToContact = () => {
    Taro.navigateTo({
      url: "/pages/profile/contact/contact",
    }).catch((err) => {
      console.error("跳转联系我们失败:", err);
    });
  };

  // 将所有状态和事件处理函数传递给视图组件
  return (
    <>
      <ProView
        loggedIn={loggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onGoToRegistration={handleGoToRegistration}
        onGoToNotifications={handleGoToNotifications}
        onGoToContact={handleGoToContact}
      />
      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default ProLogic;
