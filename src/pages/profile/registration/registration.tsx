import { View, Text, Button } from '@tarojs/components';
import { FC } from 'react';
import Taro from '@tarojs/taro';
import './registration.scss'; // 页面样式
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';

// 报名信息页面组件
const Registration: FC = () => {
    // 返回上一页的逻辑
    const handleGoBack = () => {
        Taro.navigateBack(); // 返回上一页
    };

    return (
        <View className="registration-page">
            <View className="page-header">
                <Button className="back-btn iconfont" onClick={handleGoBack}>&#xe632;</Button>
                <Text className="title">报名信息</Text>
            </View>

            <View className="content">
                {/* 页面内容区域 */}
                <Text>这里是报名信息的具体内容,这里是报名信息的具体内容,这里是报名信息的具体内容,这里是报名信息的具体内容,</Text>
                {/* 可以添加表单、列表等组件 */}
            </View>
        </View>
    );
};

export default Registration;
