import { View, Text, Button, Input, Picker, Textarea, Form } from '@tarojs/components';
import { FC, useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { AppDispatch } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getSelfInfo, userApply } from '../../../api/index';
import { fetchUserInfo } from '../../../store/userSlice'; // 导入fetchUserInfo action
import '../../progress/registration/registration.scss';
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';
import type { RootState } from '../../../store';


interface FormDataType {
    userName?: string | null;
    userNumber?: string | null;
    academy?: string | null;
    direction?: string | null;
    phone?: string | null;
    email?: string | null;
    selfIntroduction?: string | null;
}

// 报名信息页面组件
const Registration: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    // 从Redux获取用户信息和状态
    const { userInfo, status, error } = useSelector((state: RootState) => state.user);
    const loading = status === 'loading';
    const openId = Taro.getStorageSync('openId');
    console.log(openId);

    // 返回上一页的逻辑
    const handleGoBack = () => {
        Taro.navigateBack(); // 返回上一页
    };

    const [directions] = useState([
        { name: '前端' },
        { name: '后台' },
    ]);

    const [directionIndex, setDirectionIndex] = useState(0);
    const [formData, setFormData] = useState<FormDataType>({});
    const [submitting, setSubmitting] = useState(false); // 防止重复提交

    // 处理表单输入变化
    const handleInputChange = (field: keyof FormDataType, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 方向选择变化
    const bindDirectionChange = (e) => {
        const index = e.detail.value;
        setDirectionIndex(index);
        // 同步更新方向到表单数据
        setFormData(prev => ({
            ...prev,
            direction: directions[index].name
        }));
    };

    // 当userInfo变化时填充表单数据
    useEffect(() => {
        if (userInfo) {
            // 填充表单数据
            setFormData({
                userName: userInfo.name,
                userNumber: userInfo.userNumber,
                academy: userInfo.academy,
                direction: userInfo.direction,
                phone: userInfo.phoneNumber,
                email: userInfo.email,
                selfIntroduction: userInfo.userIntro
            });
            // 设置方向选择器索引
            console.log('获取的用户信息为:',userInfo)
            const dirIndex = directions.findIndex(
                item => item.name === userInfo.direction
            );
            if (dirIndex !== -1) {
                setDirectionIndex(dirIndex);
            }
        }
    }, [userInfo, directions, status, error]);

    useEffect(() => {
        const fetchData = async () => {
            const openId = Taro.getStorageSync('openId');
            if (openId) {
                // 强制重新获取最新用户信息
                await dispatch(fetchUserInfo(openId) );
            } else {
                Taro.showToast({ title: '请先登录', icon: 'none' });
            }
        };

        // 组件挂载和重新进入时都执行
        fetchData();
    }, [dispatch]);

    // 错误处理
    useEffect(() => {
        if (status === 'failed' && error) {
            Taro.showToast({ title: error, icon: 'none' });
        }
    }, [status, error, userInfo]);

    // 表单提交
    const formSubmit = async (e) => {
        // 防止重复提交s
        if (submitting) return;

        // 获取表单数据并处理
        const { userName, userNumber, academy, phoneNumber, email, userIntro } = e.detail.value;
        const direction = directions[directionIndex].name;

        // 基础表单验证
        if (!userName || !userNumber || !academy || !direction || !phoneNumber || !email) {
            Taro.showToast({ title: '请填写必填字段', icon: 'none' });
            return;
        }

        // 手机号格式验证
        const phoneReg = /^1[3-9]\d{9}$/;
        if (!phoneReg.test(phoneNumber)) {
            Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
            return;
        }

        // 邮箱格式验证
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            Taro.showToast({ title: '请输入正确的邮箱', icon: 'none' });
            return;
        }

        try {
            setSubmitting(true);
            const params = {
                userName,
                userNumber,
                academy,
                direction,
                phone: phoneNumber,
                email,
                selfIntroduction: userIntro
            };

            const response = await userApply(params);
            console.log(params);
            console.log(response);
            const r = await getSelfInfo(openId);
            console.log("a", openId)
            console.log("重新获取信息", r);

            Taro.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1500
            });

            setTimeout(() => {
                handleGoBack();
            }, 1500);

        } catch (error) {
            console.error('提交失败:', error);
            Taro.showToast({
                title: error instanceof Error ? error.message : '网络异常，请稍后再试',
                icon: 'none'
            });
        } finally {
            setSubmitting(false);
        }

    };

    // 表单重置
    const formReset = () => {
        setFormData({});
        setDirectionIndex(0);
        Taro.showToast({ title: '已重置', icon: 'none' });
    };

    return (
        <View className="registration-page">
            <View className="page-header">
                <Button className="back-btn iconfont" onClick={handleGoBack}>&#xe632;</Button>
                <Text className="title">报名信息</Text>
            </View>

            <Text className='notice'>填下这张表,C.A.T工作室下一个 “显眼包” 就是你</Text>

            <View className="content">  
                {loading ? (
                    <Text>加载中...</Text>  // 加载状态提示
                ) : (
                    <Form onSubmit={formSubmit} onReset={formReset} className="form-container">
                        {/* 姓名输入  */}
                        <View className="form-item">
                            <Text className="label">姓名：</Text>
                            <Input
                                name="userName"
                                placeholder="请输入姓名"
                                className="input"
                                value={formData.userName || ''}
                                onInput={(e) => handleInputChange('userName', e.detail.value)}
                            />
                        </View>

                        {/* 学号输入  */}
                        <View className="form-item">
                            <Text className="label">学号：</Text>
                            <Input
                                name="userNumber"
                                placeholder="请输入学号"
                                className="input"
                                value={formData.userNumber || ''}
                                onInput={(e) => handleInputChange('userNumber', e.detail.value)}
                            />
                        </View>

                        {/* 学院专业输入  */}
                        <View className="form-item">
                            <Text className="label">学院专业：</Text>
                            <Input
                                name="academy"
                                placeholder="请输入学院专业"
                                className="input"
                                value={formData.academy || ''}
                                onInput={(e) => handleInputChange('academy', e.detail.value)}
                            />
                        </View>

                        {/* 学习方向-下拉选择器*/}
                        <View className="form-item">
                            <Text className="label">学习方向：</Text>
                            <Picker
                                name="direction"
                                range={directions}
                                rangeKey="name"
                                value={directionIndex}
                                onChange={bindDirectionChange}
                                className="picker"
                            >
                                <View className="picker-view">
                                    {directions[directionIndex] ? directions[directionIndex].name : '请选择学习方向'}
                                </View>
                            </Picker>
                        </View>

                        {/* 联系方式(手机)-输入  */}
                        <View className="form-item">
                            <Text className="label">手机号：</Text>
                            <Input
                                name="phoneNumber"
                                placeholder="请输入手机号"
                                type="number"
                                className="input"
                                value={formData.phone || ''}
                                onInput={(e) => handleInputChange('phone', e.detail.value)}
                            />
                        </View>

                        {/* 联系方式(邮箱)-输入  */}
                        <View className="form-item">
                            <Text className="label">邮箱号：</Text>
                            <Input
                                name="email"
                                placeholder="请输入邮箱号"
                                type="text"
                                className="input"
                                value={formData.email || ''}
                                onInput={(e) => handleInputChange('email', e.detail.value)}
                            />
                        </View>

                        {/* 多行文本 */}
                        <View className="form-item">
                            <Text className="label">自我介绍：</Text>
                            <Textarea
                                name="userIntro"
                                placeholder="请输入自我介绍信息"
                                className="textarea"
                                autoHeight
                                value={formData.selfIntroduction || ''}
                                onInput={(e) => handleInputChange('selfIntroduction', e.detail.value)}
                            />
                        </View>

                        {/* 提交和重置按钮 */}
                        <View className="form-buttons">
                            <button
                                form-type="submit"
                                className="submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? '提交中...' : '提交'}
                            </button>
                            <button
                                form-type="reset"
                                className="reset-btn"
                                disabled={submitting}
                            >
                                重置
                            </button>
                        </View>
                    </Form>
                )}
            </View>
        </View>
    );
};

export default Registration;