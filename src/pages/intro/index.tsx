import { View, Text } from "@tarojs/components";
import BottomTabBar from "../../components/BottomTabBar";
import Taro from "@tarojs/taro";
import "../index.scss";
import { useEffect } from "react";

const IntroPage = () => {
  useEffect(() => {
    Taro.hideTabBar();
  }, []);
  return (
    <View className="page-container">
      <View className="page-content">
        <Text className="page-title">介绍页面</Text>
      </View>
      <BottomTabBar />
    </View>
  );
};

export default IntroPage;
