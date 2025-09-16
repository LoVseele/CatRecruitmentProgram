import { View, Swiper, SwiperItem } from "@tarojs/components";
import { useState } from "react";
import "./index.scss";
import BottomTabBar from "../../components/BottomTabBar/index";
import Intro from "../intro/Intro";
import PageJumpProLogic from "../progress/Progresslogic";
import ProLogic from "../profile/ProLogic";

// 定义标签页顺序映射
const tabOrder = ["intro", "progress", "profile"] as const;

const Index = () => {
  const [activeTab, setActiveTab] = useState<"intro" | "progress" | "profile">(
    "intro"
  );

  // 根据当前激活的标签获取对应的索引
  const getCurrentIndex = () => {
    return tabOrder.indexOf(activeTab);
  };

  // 当标签改变时，同步更新 swiper
  const handleTabChange = (tab: "intro" | "progress" | "profile") => {
    setActiveTab(tab);
  };

  // 当 swiper 滑动结束时，同步更新标签
  const handleSwiperChange = (e: any) => {
    const current = e.detail.current;
    const tab = tabOrder[current];
    setActiveTab(tab);
  };

  return (
    <View className="page-container">
      <Swiper
        current={getCurrentIndex()}
        duration={300}
        onChange={handleSwiperChange}
        className="swiper-container"
        style={{ flex: 1 }} // 减去底部导航栏高度
      >
        <SwiperItem>
          <Intro />
        </SwiperItem>
        <SwiperItem>
          <PageJumpProLogic />
        </SwiperItem>
        <SwiperItem>
          <ProLogic />
        </SwiperItem>
      </Swiper>
      <BottomTabBar activeKey={activeTab} onChange={handleTabChange} />
    </View>
  );
};

export default Index;
