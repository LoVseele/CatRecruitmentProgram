import { View, Text, Image } from "@tarojs/components";
import "./progress.scss";
import proCat from '../../assets/images/process_cat.png'
import { FC } from "react";

interface StageInfo {
  state: string | number; // 状态标识（可以是字符串或数字）
  text: string;          // 阶段名称/标题
  intro: string;         // 阶段简介
  style: any;
}

// 本地预设的阶段数据
const stageData: StageInfo[] = [
  { state: "unRegister", text: "未报名", intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧", style: { display: 'none' } },
  { state: "register", text: "报名完成", intro: "成功报名 ! 离进入C.A.T不远了", style: { bottom: '35%', left: '5%' } },
  { state: "interview", text: "面试", intro: "面试时间到 ! 点我 预约面试时间", style: { bottom: '41%', left: '21%' } },
  { state: "finst", text: "第一轮考核", intro: "第一轮考核 , 考验你的基本功", style: { bottom: '58%', left: '36%' } },
  { state: "second", text: "第二轮考核", intro: "第二轮考核 , 考验你的耐心和细心", style: { bottom: '71%', left: '51%' } },
  { state: "offer", text: "成功录取", intro: "恭喜你成为C.A.T的成员 !", style: { bottom: '23%', left: '89%' } }
];

const stage = stageData[0];

// 定义视图组件接收的属性类型
interface ProProps {
  onGoToRegistration: () => void;
  onGoToInterview: () => void;
}

// 纯视图组件，只负责渲染UI和触发事件
const Intro: FC<ProProps> = ({
  onGoToRegistration,
  onGoToInterview,
}) => (
  <View className="progress">
    <View className="progress-show">
      <Image
        src={proCat}
        className="proCat"
        style={{
          position: 'absolute' as const,
          ...stage.style
        }}
      ></Image>
    </View>
    <View className="progress-content"
      onClick={stage.state === 'unRegister' ? onGoToRegistration : stage.state === 'interview' ? onGoToInterview : undefined}>
      <Text>当前阶段: {stage.text}</Text>
      <Text>{stage.intro}</Text>
    </View>
  </View>
);

export default Intro;
