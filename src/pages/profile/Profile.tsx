import { View, Text, Image } from "@tarojs/components";
import { FC } from "react";
import "../index.scss";
import "./profile.scss";

// 定义视图组件接收的属性类型
interface ProProps {
  onGoToRegistration: () => void;
  onGoToNotifications: () => void;
  onGoToContact: () => void;
}

// 定义图片组件的属性类型
interface ImageProps {
  src?: string; // 让 src 变为可选
  className: string;
}

const CustomImage: FC<ImageProps> = ({ src, className }) =>
  // 如果 src 为空，可以渲染占位图或不渲染
  src ? (
    <Image className={className} src={src} />
  ) : (
    <View className={className} />
  );

// 纯视图组件，只负责渲染UI和触发事件
const ProView: FC<ProProps> = ({
  onGoToRegistration,
  onGoToNotifications,
  onGoToContact,
}) => (
  <View className="page-content">
    {/* 使用自定义组件，或直接给 src 传空字符串（需处理占位） */}
    <CustomImage className="avatar" src="" />
    <Text className="name">姓名:</Text>
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
  </View>
);

export default ProView;
