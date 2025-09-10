import { View, Text, Image, Button } from "@tarojs/components";
import { FC } from "react";
import "./profile.scss";
import UserAvatar from "../../assets/images/logo.png"; // 引入一个默认头像

// 更新视图组件接收的属性类型
interface ProProps {
  loggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onGoToRegistration: () => void;
  onGoToNotifications: () => void;
  onGoToContact: () => void;
}

// 纯视图组件，只负责渲染UI和触发事件
const ProView: FC<ProProps> = ({
  loggedIn,
  onLogin,
  onLogout,
  onGoToRegistration,
  onGoToNotifications,
  onGoToContact,
}) => (
  <View className="page-content">
    <Image className="avatar" src={UserAvatar} />
    {loggedIn ? (
      // --- 已登录状态 ---
      <View className="name">
        <Text>欢迎回来！</Text>
        {/* 这里可以显示真实用户名 */}
      </View>
    ) : (
      // --- 未登录状态 ---
      <View className="login-prompt">
        <Button size="mini" className="login-btn" onClick={onLogin}>
          点击登录
        </Button>
      </View>
    )}

    <View className="list">
      <View className="list-item list-item1" onClick={onGoToRegistration}>
        报名信息
      </View>
      <View className="list-item list-item2" onClick={onGoToNotifications}>
        我的通知
      </View>
      <View className="list-item list-item3" onClick={onGoToContact}>
        联系我们
      </View>
    </View>

    {/* 只有在登录后才显示退出按钮 */}
    {loggedIn && (
      <Button className="logout-button" onClick={onLogout}>
        退出登录
      </Button>
    )}
  </View>
);

export default ProView;
