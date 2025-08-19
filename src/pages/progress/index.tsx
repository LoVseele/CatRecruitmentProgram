import { View, Text } from "@tarojs/components";
import BottomTabBar from "../../components/BottomTabBar";
import Taro from "@tarojs/taro";
import { useEffect } from "react";
import "../index.scss";
``;
const ProgressPage = () => {
  useEffect(() => {
    Taro.hideTabBar();
  }, []);
  return (
    <View className="page-container">
      <View className="page-content">
        <Text className="page-title">进度页面</Text>
      </View>
      <BottomTabBar />
    </View>
  );
};

export default ProgressPage;
