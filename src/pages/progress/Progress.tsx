import { View, Text, Image } from "@tarojs/components";
import "./progress.scss";
import proCat from '../../assets/images/process_cat.png'
import { FC, useEffect, useState } from "react";
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';

// 定义阶段数据类型
interface StageInfo {
  state: string | number;
  text: string; 
  intro: string;
  style: any;
}

// 本地阶段数据
const stageData: StageInfo[] = [
  { state: "未报名", text: "未报名", intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧", style: { display: 'none' } },
  { state: "已报名", text: "预约面试", intro: "面试时间到 ! 点我 预约面试时间", style: { bottom: '41%', left: '21%' } },
  { state: "一面", text: "一轮考核", intro: "第一轮考核 , 考验你的基本功", style: { bottom: '58%', left: '36%' } },
  { state: "二面", text: "二轮考核", intro: "第二轮考核 , 考验你的耐心和细心", style: { bottom: '71%', left: '51%' } },
];

// 组件接收的属性类型
interface ProProps {
  onGoToRegistration: () => void;
  onGoToInterview: () => void;
}

// 核心组件
const Intro: FC<ProProps> = ({
  onGoToRegistration,
  onGoToInterview,
}) => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [matchedStage, setMatchedStage] = useState<StageInfo>(stageData[0]); 

  //  用户信息变化时，匹配对应的阶段
  useEffect(() => {
    if (userInfo?.state) {
      console.log("用户当前状态:", userInfo.state);
      const foundStage = stageData.find(stage => stage.state === userInfo.state);

      if (foundStage) {
        setMatchedStage(foundStage); 
      } else {
        setMatchedStage(stageData[0]); 
        console.log("未找到匹配状态，使用默认「未报名」");
      }
    } else {
      setMatchedStage(stageData[0]); // 无用户信息：默认未报名
    }
  }, [userInfo]); 

  // 打印用户状态
  useEffect(() => {
    if (userInfo?.state) {
      console.log("用户信息（调试）:", userInfo.state);
    }
  }, [userInfo]);

  return (
    <View className="progress">
      {/* 猫图片：使用匹配阶段的样式 */}
      <View className="progress-show">
        <Image
          src={proCat}
          className="proCat"
          style={{
            position: 'absolute' as const,
            ...matchedStage.style // 动态应用当前阶段的定位样式
          }}
        />
      </View>

      {/* 绑定点击事件 */}
      <View
        className="progress-content"
        onClick={() => {
          if (matchedStage.state === "未报名") {
            onGoToRegistration(); 
          } else if (matchedStage.state === "已报名") {
            onGoToInterview(); 
          }
        }}
      >
        <Text>当前阶段: {matchedStage.text}</Text>
        <Text>{matchedStage.intro}</Text>
      </View>
    </View>
  );
};

export default Intro;