// pages/intro/Intro.tsx
import { View, Text} from "@tarojs/components";
import "../index.scss";
import "./profile.scss";

const Intro = () => (
  <View className="page-content">
    <image className="avatar"/>
    <Text className="name">姓名:</Text>
    <view className="list">
      <view className="list-item list-item1">报名信息</view>
      <view className="list-item list-item2">我的通知</view>
      <view className="list-item list-item3">联系我们</view>
    </view>
  </View>
);

export default Intro;
