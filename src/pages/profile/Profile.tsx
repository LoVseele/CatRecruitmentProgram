import { View, Text, Image, Button } from "@tarojs/components";
import { FC } from "react";
import "./profile.scss";
import "../index.scss";
import UserAvatar from "../../assets/images/avatar.png"; // 引入一个默认头像
import { User } from "@/api/types";

// 更新视图组件接收的属性类型
interface ProProps {
  loggedIn: boolean;
  userInfo: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onGoToRegistration: () => void;
  onGoToNotifications: () => void;
  onGoToContact: () => void;
}

// 纯视图组件，只负责渲染UI和触发事件
const ProView: FC<ProProps> = ({
  loggedIn,
  userInfo,
  onLogin,
  onLogout,
  onGoToRegistration,
  onGoToNotifications,
  onGoToContact,
}) => (
  <View className="page-content">
    <Image className="avatar" src={UserAvatar} />
    {loggedIn && userInfo ? (
      // --- 已登录状态 ---
      <View className="name">
        <Text>欢迎回来！{userInfo.name || "新同学"}</Text>
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
      <Button size="mini" className="logout-btn" onClick={onLogout}>
        退出登录
      </Button>
    )}
  </View>
);

export default ProView;
