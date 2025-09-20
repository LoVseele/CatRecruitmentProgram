import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { AppDispatch } from '../../store';
import { fetchAppointmentState } from "../../store/interviewSlice";
import { getAllInterviewTime } from "../../api/index";
import "./progress.scss";
import proCat from '../../assets/images/process_cat.png'
import { FC } from "react";
import { InterviewTime, ApiResponse } from "../../api/types";

interface StageInfo {
  state: string | number;
  text: string;
  intro: string;
  style: any;
}

const stageData: StageInfo[] = [
  { state: "未报名", text: "未报名", intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧", style: { display: 'none' } },
  { state: "已报名", text: "已报名", intro: "成功报名 ! 点我 预约面试时间吧", style: { bottom: '35%', left: '5%' } },
  { state: "初面", text: "面试", intro: "", style: { bottom: '41%', left: '21%' } },
  { state: "初面通过", text: "面试通过", intro: "面试通过啦! 好好准备面对一轮!", style: { bottom: '58%', left: '36%' } },
  { state: "一面", text: "一轮面试", intro: "", style: { bottom: '58%', left: '36%' } },
  { state: "一轮考核通过", text: "一轮考核通过!", intro: "一轮考核通过啦! 离胜利不远了!", style: { bottom: '71%', left: '51%' } },
  { state: "二面", text: "二轮面试", intro: "", style: { bottom: '71%', left: '51%' } },
  { state: "二轮考核通过", text: "二轮考核通过!", intro: "恭喜你成为C.A.T的成员 !", style: { bottom: '23%', left: '89%' } },
  { state: "已通过", text: "成功录取", intro: "恭喜你成为C.A.T的成员 !", style: { bottom: '23%', left: '89%' } }
];

interface ProProps {
  onGoToRegistration: () => void;
  onGoToInterview: () => void;
}

const Intro: FC<ProProps> = ({
  onGoToRegistration,
  onGoToInterview,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userAppointmentId } = useSelector((state: RootState) => state.interview);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [matchedStage, setMatchedStage] = useState<StageInfo>(stageData[0]);
  const [displayIntro, setDisplayIntro] = useState<string>(matchedStage.intro);
  const [interviewTimes, setInterviewTimes] = useState<InterviewTime[]>([]);

  // 封装数据加载逻辑为独立函数
  const loadAllData = async () => {
    try {
      // 刷新预约状态
      await dispatch(fetchAppointmentState()).unwrap();

      // 刷新面试时间
      const response: ApiResponse<InterviewTime[]> = await getAllInterviewTime();
      setInterviewTimes(response.data || []);
      console.log("刷新获取到的面试时间", response.data);
    } catch (error) {
      console.error("数据刷新失败:", error);
    }
  };

  // 关键修改：添加用户登录状态相关依赖，确保登录状态变化时重新加载数据
  useEffect(() => {
    // 每次组件挂载/更新时都刷新数据
    loadAllData();
  }, [dispatch, userInfo?.userId, userInfo?.state]); // 监听用户ID和状态变化

  // 处理用户状态匹配
  useEffect(() => {
    if (userInfo?.state) {
      const foundStage = stageData.find(stage => stage.state === userInfo.state);
      setMatchedStage(foundStage || stageData[0]);
    } else {
      setMatchedStage(stageData[0]);
    }
  }, [userInfo]);

  // 处理面试时间显示
  useEffect(() => {
    const timeRequiredStates = ["初面", "一面", "二面"];
    const currentState = userInfo?.state;

    if (typeof currentState === 'string' &&
      timeRequiredStates.includes(currentState) &&
      userAppointmentId) {
      const matchedTime = interviewTimes.find(
        (time: InterviewTime) => time.id === userAppointmentId
      );

      if (matchedTime) {
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleString();
        };

        setDisplayIntro(
          `面试时间:  ${formatDate(matchedTime.startTime)} - ${formatDate(matchedTime.endTime)}`
        );
        return;
      }
    }

    setDisplayIntro(matchedStage.intro);
  }, [matchedStage, userAppointmentId, interviewTimes, userInfo?.state]);

  return (
    <View className="progress">
      <View className="progress-show">
        <Image
          src={proCat}
          className="proCat"
          style={{
            position: 'absolute' as const,
            ...matchedStage.style
          }}
        />
      </View>

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
        <Text className="Intro">{displayIntro}</Text>
      </View>
    </View>
  );
};

export default Intro;

// import { View, Text, Image } from "@tarojs/components";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/index";
// import { AppDispatch } from '../../store';
// import { fetchAppointmentState, fetchInterviewTimes } from "../../store/interviewSlice";
// import "./progress.scss";
// import proCat from '../../assets/images/process_cat.png'
// import { FC } from "react";
// import { InterviewTime } from "../../api/types"; // 导入面试时间类型
// import { getAllInterviewTime } from "../../api/index";

// interface StageInfo {
//   state: string | number;
//   text: string;
//   intro: string;
//   style: any;
// }

// const stageData: StageInfo[] = [
//   { state: "未报名", text: "未报名", intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧", style: { display: 'none' } },
//   { state: "已报名", text: "已报名", intro: "成功报名 ! 点我 预约面试时间吧", style: { bottom: '35%', left: '5%' } },
//   { state: "初面", text: "预约面试", intro: "", style: { bottom: '41%', left: '21%' } },
//   { state: "初面通过", text: "面试通过", intro: "面试通过啦! 好好准备面对一轮!", style: { bottom: '58%', left: '36%' } },
//   { state: "一面", text: "一轮面试", intro: "", style: { bottom: '58%', left: '36%' } },
//   { state: "一轮考核通过", text: "一轮考核通过!", intro: "一轮考核通过啦! 离胜利不远了!", style: { bottom: '71%', left: '51%' } },
//   { state: "二面", text: "二轮面试", intro: "", style: { bottom: '71%', left: '51%' } },
//   { state: "二轮考核通过", text: "二轮考核通过!", intro: "恭喜你成为C.A.T的成员 !", style: { bottom: '23%', left: '89%' } },
//   { state: "已通过", text: "成功录取", intro: "恭喜你成为C.A.T的成员 !", style: { bottom: '23%', left: '89%' } }
// ];

// interface ProProps {
//   onGoToRegistration: () => void;
//   onGoToInterview: () => void;
// }

// const Intro: FC<ProProps> = ({
//   onGoToRegistration,
//   onGoToInterview,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { userAppointmentId } = useSelector((state: RootState) => state.interview);
//   const { userInfo } = useSelector((state: RootState) => state.user);
//   const [matchedStage, setMatchedStage] = useState<StageInfo>(stageData[0]);
//   const [displayIntro, setDisplayIntro] = useState<string>(matchedStage.intro);
//   const [interviewTimes, setInterviewTimes] = useState<InterviewTime[]>([]);

//   useEffect(() => {
//     dispatch(fetchAppointmentState());
//     // 调用API获取面试时间
//     const loadInterviewTimes = async () => {
//       try {
//         const data = await getAllInterviewTime();
//         console.log("获取的面试时间为:",data);
//       } catch (error) {
//         console.error("获取面试时间失败:", error);
//         setInterviewTimes([]);
//       }
//     };

//     loadInterviewTimes();
//   }, [dispatch]);

//   // 处理用户状态匹配
//   useEffect(() => {
//     if (userInfo?.state) {
//       const foundStage = stageData.find(stage => stage.state === userInfo.state);
//       setMatchedStage(foundStage || stageData[0]);
//     } else {
//       setMatchedStage(stageData[0]);
//     }
//   }, [userInfo]);

//   // 处理面试时间显示
//   useEffect(() => {
//     // 需要显示时间的状态列表
//     const timeRequiredStates = ["初面", "一面", "二面"];
//     const currentState = userInfo?.state;
//     const interviewTimes = await getAllInterviewTime();

//     console.log("获取到的面试时间",interviewTimes);
//     // 确保currentState是有效的字符串
//     if (typeof currentState === 'string' &&
//       timeRequiredStates.includes(currentState) &&
//       userAppointmentId) {
//       // 查找匹配的面试时间
//       const matchedTime = interviewTimes.find(
//         (time: InterviewTime) => time.id === userAppointmentId
//       );

//       if (matchedTime) {
//         // 格式化日期和时间
//         const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
//         setDisplayIntro(`面试时间: ${formatDate(matchedTime.appointmentDate)} ${formatDate(matchedTime.startTime)} - ${formatDate(matchedTime.endTime)}`);
//         return;
//       }
//     }

//     // 其他情况显示默认介绍
//     setDisplayIntro(matchedStage.intro);
//   }, [matchedStage, userAppointmentId, interviewTimes, userInfo?.state]);

//   return (
//     <View className="progress">
//       <View className="progress-show">
//         <Image
//           src={proCat}
//           className="proCat"
//           style={{
//             position: 'absolute' as const,
//             ...matchedStage.style
//           }}
//         />
//       </View>

//       <View
//         className="progress-content"
//         onClick={() => {
//           if (matchedStage.state === "未报名") {
//             onGoToRegistration();
//           } else if (matchedStage.state === "已报名") {
//             onGoToInterview();
//           }
//         }}
//       >
//         <Text>当前阶段: {matchedStage.text}</Text>
//         <Text>{displayIntro}</Text> {/* 使用处理后的介绍文本 */}
//       </View>
//     </View>
//   );
// };

// export default Intro;