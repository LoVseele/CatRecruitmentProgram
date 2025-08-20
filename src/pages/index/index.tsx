import { View } from "@tarojs/components";
import { useState } from "react";
import "./index.scss";
import BottomTabBar from "../../components/BottomTabBar/index";
import Intro from "../intro/Intro";
import Progress from "../progress/Progress";
import Profile from "../profile/Profile";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"intro" | "progress" | "profile">(
    "intro"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "intro":
        return <Intro />;
      case "progress":
        return <Progress />;
      case "profile":
        return <Profile />;
      default:
        return <Intro />;
    }
  };
  console.log(activeTab);
  return (
    <View className="page-container">
      {renderContent()}
      <BottomTabBar activeKey={activeTab} onChange={setActiveTab} />
    </View>
  );
};

export default Index;
