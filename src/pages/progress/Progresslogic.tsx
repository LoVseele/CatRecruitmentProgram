import { FC } from "react";
import Taro from "@tarojs/taro";
import Intro from "./Progress";

// 逻辑组件，处理所有业务逻辑
const PageJumpProLogic: FC = () => {
    // 报名信息页面跳转逻辑
    const handleGoToRegistration = () => {
        Taro.navigateTo({
            url: "/pages/progress/registration/registration",
        }).catch((err) => {
            console.error("跳转报名信息失败:", err);
        });
    };
    //预约页面跳转
    const handleGoToInterview = () => {
        Taro.navigateTo({
            url: "/pages/progress/interview/interview"
        }).catch((err) => {
            console.error('预约页面跳转失败:', err)
        })
    }

    // 将事件处理函数传递给视图组件
    return (
        <Intro
            onGoToRegistration={handleGoToRegistration}
            onGoToInterview={handleGoToInterview}
        />
    );
};

export default PageJumpProLogic;