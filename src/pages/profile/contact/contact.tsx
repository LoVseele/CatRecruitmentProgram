import { View, Text, Button , Image} from '@tarojs/components';
import { FC } from 'react';
import Taro from '@tarojs/taro';
import './contact.scss'; // 页面样式
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';
import contactPic from '../../../assets/images/contact.jpg'

// 报名信息页面组件
const contact: FC = () => {
    // 返回上一页的逻辑
    const handleGoBack = () => {
        Taro.navigateBack(); // 返回上一页
    };

    return (
        <View className="contact-page">
            <View className="page-header">
                <Button className="back-btn iconfont" onClick={handleGoBack}>&#xe632;</Button>
                <Text className="title">联系我们</Text>
            </View>

            <View className="contact">
                <View className='contact-pic-box'>
                    <View className='contact-pic-content'>
                        <Text>欢迎加入招新Q群</Text>
                        <Text>有任何疑问欢迎进群咨询</Text>
                    </View>
                    <Image
                        src={contactPic}
                        className='contact-pic'
                    ></Image>
                </View>
                <View className='contact-content'>
                    <Text>社恐? 不想进群?</Text>
                    <Text>欢迎直接和师兄师姐们电话联系!</Text>
                    <Text>联系电话:15015944299</Text>
                </View>
            </View>
        </View>
    );
};

export default contact;