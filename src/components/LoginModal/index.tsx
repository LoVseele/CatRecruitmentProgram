import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { userLogin } from "../../api/index";
import { setToken } from "../../utils/auth";
import "./index.scss";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ visible, onClose, onLoginSuccess }: LoginModalProps) => {
  const handleLogin = () => {
    Taro.login({
      success: async (res) => {
        if (res.code) {
          console.log(res.code);
          try {
            // --- ↓↓↓ 关键修改点 ↓↓↓ ---
            // 直接传递一个 { code: res.code } 对象，完美匹配您最新的 LoginParams 类型
            const loginRes = await userLogin({ code: res.code });
            console.log(loginRes);
            if (loginRes.code === 200 && loginRes.data.token) {
              setToken(loginRes.data.token);
              Taro.showToast({
                title: "登录成功",
                icon: "success",
              });
              onLoginSuccess();
              onClose();
            } else {
              Taro.showToast({
                title: loginRes.message || "登录失败",
                icon: "none",
              });
            }
          } catch (error) {
            console.error("登录请求在业务层捕获到错误", error);
          }
        } else {
          console.error("获取微信 code 失败！" + res.errMsg);
          Taro.showToast({
            title: "微信登录授权失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("Taro.login 调用失败", err);
        Taro.showToast({
          title: "无法调起微信登录",
          icon: "none",
        });
      },
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <View className="login-modal-overlay">
      <View className="login-modal-content">
        <View className="login-modal-title">您还未登录</View>
        <View className="login-modal-body">请先登录以继续操作</View>
        <Button className="login-button" type="primary" onClick={handleLogin}>
          微信一键登录
        </Button>
        <Button className="close-button" onClick={onClose}>
          取消
        </Button>
      </View>
    </View>
  );
};

export default LoginModal;
