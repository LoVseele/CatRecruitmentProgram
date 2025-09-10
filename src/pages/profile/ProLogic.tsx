// src/pages/profile/ProLogic.tsx

import { FC, useState } from "react";
import Taro from "@tarojs/taro";
import ProView from "./Profile";
import LoginModal from "../../components/LoginModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/userSlice";

const ProLogic: FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  // 登录状态由 Redux store 中的 token 决定
  const loggedIn = !!token;

  // 点击登录按钮时，显示弹窗
  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  // 登录成功后的回调
  const handleLoginSuccess = () => {};

  // 点击退出登录
  const handleLogout = () => {
    //分发 logout action
    dispatch(logout());
    Taro.showToast({
      title: "已退出登录",
      icon: "success",
    });
  };

  // --- 页面跳转逻辑  ---
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
