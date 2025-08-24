import { View, Text, Button, Input, Picker, Textarea, Form } from '@tarojs/components';
import { FC, useState } from 'react';
import Taro from '@tarojs/taro';
import './registration.scss';
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';

// 报名信息页面组件
const Registration: FC = () => {
    // 返回上一页的逻辑
    const handleGoBack = () => {
        Taro.navigateBack(); // 返回上一页
    };

    const [directions] = useState([
        { name: '前端' },
        { name: '后台' },
    ]);

    const [directionIndex, setdirectionIndex] = useState(0);
    const [formData, setFormData] = useState({});
    const [showResult, setShowResult] = useState(false);

    // 方向选择变化
    const binddirectionChange = (e) => {
        setdirectionIndex(e.detail.value);
    };

    // 表单提交
    const formSubmit = (e) => {
        setFormData(e.detail.value);
        setShowResult(true);
    };

    // 表单重置
    const formReset = () => {
        setShowResult(false);
    };

    return (
        <View className="registration-page">
            <View className="page-header">
                <Button className="back-btn iconfont" onClick={handleGoBack}>&#xe632;</Button>
                <Text className="title">报名信息</Text>
            </View>

            <View className="content">
                <Form onSubmit={formSubmit} onReset={formReset} className="form-container">
                    {/* 姓名输入  */}
                    <View className="form-item">
                        <Text className="label">姓名：</Text>
                        <Input
                            name="userName"
                            placeholder="请输入姓名"
                            className="input"
                        />
                    </View>

                    {/* 学号输入  */}
                    <View className="form-item">
                        <Text className="label">学号：</Text>
                        <Input
                            name="userNumber"
                            placeholder="请输入学号"
                            className="input"
                        />
                    </View>

                    {/* 学院专业输入  */}
                    <View className="form-item">
                        <Text className="label">学院专业：</Text>
                        <Input
                            name="academy"
                            placeholder="请输入学院专业"
                            className="input"
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
                            onChange={binddirectionChange}
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
                        />
                    </View>

                    {/* 多行文本 */}
                    <View className="form-item">
                        <Text className="label">自我介绍：</Text>
                        <Textarea
                            name="userIntro"
                            placeholder="请输入自我介绍信息"
                            className="textarea"
                            auto-height
                        />
                    </View>

                    {/* 提交和重置按钮 */}
                    <View className="form-buttons">
                        <button form-type="submit" className="submit-btn">提交</button>
                        <button form-type="reset" className="reset-btn">重置</button>
                    </View>
                </Form>
            </View>
        </View>
    );
};

export default Registration;
