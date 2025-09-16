import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { login } from "../../store/userSlice";
import "./index.scss";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ visible, onClose, onLoginSuccess }: LoginModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    Taro.login({
      success: (res) => {
        if (res.code) {
          // 分发在 userSlice 中定义的 login 异步 action
          dispatch(login({ code: res.code }))
            .unwrap()
            .then(() => {
              Taro.showToast({
                title: "登录成功",
                icon: "success",
              });
              onLoginSuccess(); // 调用父组件传入的回调
              onClose();
            })
            .catch((error: any) => {
              Taro.showToast({
                title: error.message || "登录失败",
                icon: "none",
              });
            });
        } else {
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
