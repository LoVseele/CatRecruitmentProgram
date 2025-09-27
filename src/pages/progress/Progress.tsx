import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { AppDispatch } from '../../store';
import { fetchAppointmentState, cancelInterviewAppointment } from "../../store/interviewSlice";
import { getAllInterviewTime } from "../../api/index";
import "./progress.scss";
import proCat from '../../assets/images/process_cat.png'
import { FC } from "react";
import { InterviewTime, ApiResponse } from "../../api/types";
import Taro from '@tarojs/taro';

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

  // 格式化日期时间的方法 - 组合日期和时间
  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      // 将日期和时间拼接成完整的ISO格式字符串 (例如: "2021-09-10T10:00:00")
      const fullDateTime = `${dateString}T${timeString}`;
      const date = new Date(fullDateTime);

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return "时间格式错误";
      }

      return date.toLocaleString();
    } catch (error) {
      console.error("时间格式化失败:", error);
      return "时间信息无效";
    }
  };

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

  // 处理取消预约逻辑
  const handleCancelAppointment = async () => {
    console.log("进入取消预约处理函数"); // 第一步日志

    // 1. 检查预约ID是否存在（增加详细日志）
    console.log("当前userAppointmentId值:", userAppointmentId);
    if (!userAppointmentId) {
      console.error("终止执行：userAppointmentId为空");
      Taro.showToast({ title: '未获取到预约信息', icon: 'none' });
      return;
    }

    try {
      // 2. 检查interviewTimes是否有效
      //console.log("interviewTimes数据:", interviewTimes);
     // if (!interviewTimes || !Array.isArray(interviewTimes) || interviewTimes.length === 0) {
       // console.error("终止执行：interviewTimes无效或为空");
//Taro.showToast({ title: '预约时间数据加载失败', icon: 'none' });
       // return;
     // }

      // 3. 获取当前预约对应的accessType
      const matchedTime = interviewTimes.find(
        (time: InterviewTime) => time.id === userAppointmentId
      );

      // 4. 检查匹配结果
      console.log("找到的匹配时间:", matchedTime);
      if (!matchedTime) {
        console.error(`未找到ID为${userAppointmentId}的预约信息`);
        Taro.showToast({ title: '未找到对应的预约信息', icon: 'none' });
        return;
      }

      // 5. 再次确认参数完整性
      if (!matchedTime.accessType) {
        console.error("终止执行：accessType为空");
        Taro.showToast({ title: '预约信息不完整', icon: 'none' });
        return;
      }

      // 6. 调用取消预约接口（增加接口调用日志）
      console.log("开始调用取消接口，参数:", {
        id: userAppointmentId,
        accessType: matchedTime.accessType
      });
      const response =  await dispatch(cancelInterviewAppointment({
        id: userAppointmentId,
        accessType: matchedTime.accessType
      })).unwrap();
      // 或直接打印整个响应，查看完整结构
      console.log("接口成功响应数据：", response);
      // 7. 操作成功处理
      Taro.showToast({ title: '取消预约成功', icon: 'success' });
      console.log("取消成功，开始刷新数据");
      loadAllData();

    } catch (error) {
      // 8. 完善错误处理
      console.error('取消预约失败:', error);
      const errorMsg = error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : '取消预约失败，请稍后重试';
      Taro.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 3000
      });
    }
  };

  // 判断是否显示取消预约按钮（根据是否有预约信息）
  const shouldShowCancel = () => {
    // 核心逻辑：只要存在有效的预约ID，就认为有预约信息，显示取消按钮
    const hasAppointment = !!userAppointmentId; // 用双感叹号转为布尔值（存在则为true）

    // 打印日志确认判断依据
    console.log("是否显示取消按钮:", hasAppointment);
    console.log("判断依据（预约ID是否存在）:", { userAppointmentId });

    return hasAppointment;
  };
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

    console.log("用户预约面试ID:", userAppointmentId);

    if (typeof currentState === 'string' &&
      timeRequiredStates.includes(currentState) &&
      userAppointmentId) {

      const matchedTime = interviewTimes.find(
        (time: InterviewTime) => time.id === userAppointmentId
      );
      console.log("对应的时间:", matchedTime);
      if (matchedTime && matchedTime.appointmentDate && matchedTime.startTime && matchedTime.endTime) {
        // 使用组合的日期时间进行格式化
        setDisplayIntro(
          `面试时间:\n  ${formatDateTime(matchedTime.appointmentDate, matchedTime.startTime)} - ${formatDateTime(matchedTime.appointmentDate, matchedTime.endTime)}`
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

        {shouldShowCancel() && (
          <View
            className="cancel-appointment"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelAppointment();
            }}
          >
            <Text>取消预约</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Intro;
