import { View, Text, Image } from "@tarojs/components";
import "./progress.scss";
import proCat from '../../assets/images/process_cat.png'
import { FC, useEffect, useState } from "react"; // 导入useState用于状态管理
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';

// 定义阶段数据类型
interface StageInfo {
  state: string | number; // 支持字符串/数字类型的状态标识
  text: string;          // 阶段显示文本
  intro: string;         // 阶段简介
  style: any;            // 猫图片定位样式
}

// 本地预设阶段数据（与你提供的完全一致）
const stageData: StageInfo[] = [
  { state: "未报名", text: "未报名", intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧", style: { display: 'none' } },
  { state: "已报名", text: "预约面试", intro: "面试时间到 ! 点我 预约面试时间", style: { bottom: '41%', left: '21%' } },
  { state: "一面", text: "一轮考核", intro: "第一轮考核 , 考验你的基本功", style: { bottom: '58%', left: '36%' } },
  { state: "二面", text: "二轮考核", intro: "第二轮考核 , 考验你的耐心和细心", style: { bottom: '71%', left: '51%' } },
];

// 组件接收的属性类型
interface ProProps {
  onGoToRegistration: () => void; // 跳转报名页回调
  onGoToInterview: () => void;    // 跳转预约面试回调
}

// 核心组件
const Intro: FC<ProProps> = ({
  onGoToRegistration,
  onGoToInterview,
}) => {
  //  从Redux获取用户信息和Dispatch
  const { userInfo } = useSelector((state: RootState) => state.user);

  //  初始化
  const [matchedStage, setMatchedStage] = useState<StageInfo>(stageData[0]); 


  //  用户信息变化时，匹配对应的阶段
  useEffect(() => {
    if (userInfo?.state) {
      console.log("用户当前状态:", userInfo.state);
      // 查找与用户状态匹配的阶段
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

  // 打印用户状态（调试用，可保留或删除）
  useEffect(() => {
    if (userInfo?.state) {
      console.log("用户信息（调试）:", userInfo.state);
    }
  }, [userInfo]);

  // 渲染UI（完全基于匹配到的阶段动态显示）
  return (
    <View className="progress">
      {/* 猫图片：使用匹配阶段的样式 */}
      <View className="progress-show">
        <Image
          src={proCat}
          className="proCat"
          style={{
            position: 'absolute' as const, // 类型断言确保TS不报错
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