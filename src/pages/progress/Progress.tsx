import { View, Text, Image, Button } from "@tarojs/components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAppointmentState,
  cancelAppointment,
} from "../../store/interviewSlice";
import "./progress.scss";
import proCat from "../../assets/images/process_cat.png";
import { FC } from "react";
import { InterviewTime } from "../../api/types";
import Taro from "@tarojs/taro";

interface StageInfo {
  state: string | number;
  text: string;
  intro: string;
  style: any;
}

const stageData: StageInfo[] = [
  {
    state: "未报名",
    text: "未报名",
    intro: "你还没报名哦, 点我 报名加入C.A.T工作室吧",
    style: { display: "none" },
  },
  {
    state: "已报名",
    text: "已报名",
    intro: "成功报名 ! 点我 预约面试时间吧",
    style: { bottom: "35%", left: "5%" },
  },
  {
    state: "初面",
    text: "面试",
    intro: "成功报名 ! 点我 预约面试时间吧",
    style: { bottom: "41%", left: "21%" },
  },
  {
    state: "初面通过",
    text: "面试通过",
    intro: "面试通过啦! 好好准备面对一轮!",
    style: { bottom: "58%", left: "36%" },
  },
  {
    state: "一面",
    text: "一轮面试",
    intro: "一面开始啦，点我预约一面时间吧",
    style: { bottom: "58%", left: "36%" },
  },
  {
    state: "一轮考核",
    text: "一轮面试",
    intro: "一面开始啦，点我预约一面时间吧",
    style: { bottom: "58%", left: "36%" },
  },
  {
    state: "一轮考核通过",
    text: "一轮考核通过!",
    intro: "一轮考核通过啦! 离胜利不远了!",
    style: { bottom: "71%", left: "51%" },
  },
  {
    state: "二面",
    text: "二轮面试",
    intro: "二面开始啦，点我预约一面时间吧",
    style: { bottom: "71%", left: "51%" },
  },
  {
    state: "二轮考核",
    text: "二轮面试",
    intro: "二面开始啦，点我预约一面时间吧",
    style: { bottom: "71%", left: "51%" },
  },
  {
    state: "二轮考核通过",
    text: "二轮考核通过!",
    intro: "恭喜你成为C.A.T的成员 !",
    style: { bottom: "23%", left: "89%" },
  },
  {
    state: "已通过",
    text: "成功录取",
    intro: "恭喜你成为C.A.T的成员 !",
    style: { bottom: "23%", left: "89%" },
  },
];

interface ProProps {
  onGoToRegistration: () => void;
  onGoToInterview: () => void;
}

const Intro: FC<ProProps> = ({ onGoToRegistration, onGoToInterview }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userAppointmentId, interviewTimes } = useSelector(
    (state: RootState) => state.interview
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [matchedStage, setMatchedStage] = useState<StageInfo>(stageData[0]);
  const [displayIntro, setDisplayIntro] = useState<string>(matchedStage.intro);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 格式化日期时间的方法 - 组合日期和时间
  const formatDateTime = (dateString: string, timeString: string) => {
    try {
      // 直接拼接日期和时间
      const fullDateTime = `${dateString}T${timeString}`;
      const date = new Date(fullDateTime);

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return "时间格式错误";
      }

      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("时间格式化失败:", error);
      return "时间信息无效";
    }
  };

  useEffect(() => {
    if (userInfo?.userId) {
      dispatch(fetchAppointmentState());
    }
  }, [dispatch, userInfo?.userId, userInfo?.state]);

  useEffect(() => {
    if (userInfo?.state) {
      const foundStage = stageData.find(
        (stage) => stage.state === userInfo.state
      );
      setMatchedStage(foundStage || stageData[0]);
    } else {
      setMatchedStage(stageData[0]);
    }
  }, [userInfo]);

  useEffect(() => {
    // 符合条件的才显示预约了的时间段
    const timeRequiredStates = ["初面", "一面", "一轮考核", "二轮考核", "二面"];
    const currentState = userInfo?.state;

    //这里是对条件的筛选
    if (
      typeof currentState === "string" &&
      timeRequiredStates.includes(currentState) &&
      userAppointmentId &&
      interviewTimes.length > 0
    ) {
      const matchedTime = interviewTimes.find(
        (time: InterviewTime) => time.id === userAppointmentId
      );
      if (
        matchedTime &&
        matchedTime.appointmentDate &&
        matchedTime.startTime &&
        matchedTime.endTime
      ) {
        setDisplayIntro(
          `面试时间:\n  ${formatDateTime(
            matchedTime.appointmentDate,
            matchedTime.startTime
          )} - ${formatDateTime(
            matchedTime.appointmentDate,
            matchedTime.endTime
          )}`
        );
        return;
      }
    }

    setDisplayIntro(matchedStage.intro);
  }, [matchedStage, userAppointmentId, interviewTimes, userInfo?.state]);

  // 判断是否可以取消预约
  const handleCancelAppointment = async () => {
    if (userAppointmentId && !submitting) {
      const appointmentToCancel = interviewTimes.find(
        (time) => time.id === userAppointmentId
      );

      // 如果找不到对应的预约信息（例如列表还没加载完）
      if (!appointmentToCancel) {
        Taro.showToast({ title: "预约信息加载中，请稍后重试", icon: "none" });
        return;
      }

      setSubmitting(true);
      try {
        // 正确传递 id 和 accessType
        await dispatch(
          cancelAppointment({
            id: userAppointmentId,
            accessType: appointmentToCancel.accessType,
          })
        ).unwrap();

        Taro.showToast({
          title: "取消成功",
          icon: "success",
          duration: 2000,
        });
      } catch (error) {
        Taro.showToast({
          title: error instanceof Error ? error.message : "取消失败，请重试",
          icon: "none",
          duration: 2000,
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <View className="progress">
      <View className="progress-show">
        <Image
          src={proCat}
          className="proCat"
          style={{
            position: "absolute" as const,
            ...matchedStage.style,
          }}
        />
      </View>

      <View
        className="progress-content"
        onClick={() => {
          // 定义可以跳转到预约页面的所有状态
          const canGoToInterviewStates = [
            "初面",
            "一面",
            "一轮考核",
            "二轮考核",
            "二面",
          ];

          if (matchedStage.state === "未报名") {
            onGoToRegistration();
          } else if (
            canGoToInterviewStates.includes(matchedStage.state as string) &&
            !userAppointmentId
          ) {
            onGoToInterview();
          }
        }}
      >
        <Text>当前阶段: {matchedStage.text}</Text>
        <Text className="Intro">{displayIntro}</Text>

        {/* --- 将按钮移动到这里 --- */}
        {userAppointmentId && (
          <Button
            className="cancel-appointment-btn"
            onClick={handleCancelAppointment}
            disabled={submitting}
          >
            {submitting ? "取消中..." : "取消预约"}
          </Button>
        )}
      </View>
    </View>
  );
};

export default Intro;
