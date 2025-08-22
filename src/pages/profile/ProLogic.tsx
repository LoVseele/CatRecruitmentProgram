import { FC } from "react";
import Taro from "@tarojs/taro";
import ProView from "./Profile";

// 逻辑组件，处理所有业务逻辑
const ProLogic: FC = () => {
  // 报名信息页面跳转逻辑
  const handleGoToRegistration = () => {
    Taro.navigateTo({
      url: "/pages/profile/registration/registration",
    }).catch((err) => {
      console.error("跳转报名信息失败:", err);
    });
  };

  // 我的通知页面跳转逻辑
  const handleGoToNotifications = () => {
    Taro.navigateTo({
      url: "/pages/profile/notifications/notifications",
    }).catch((err) => {
      console.error("跳转我的通知失败:", err);
    });
  };

  // 联系我们页面跳转逻辑
  const handleGoToContact = () => {
    Taro.navigateTo({
      url: "/pages/profile/contact/contact",
    }).catch((err) => {
      console.error("跳转联系我们失败:", err);
    });
  };

  // 将事件处理函数传递给视图组件
  return (
    <ProView
      onGoToRegistration={handleGoToRegistration}
      onGoToNotifications={handleGoToNotifications}
      onGoToContact={handleGoToContact}
    />
  );
};

export default ProLogic;
