import Taro from '@tarojs/taro'
import { View, Text } from "@tarojs/components";
import { useRouter } from "@tarojs/taro"
import "./index.scss"

interface TabBarItem {
    key: string
    text: string
    pagePath: string
}

const BottomTabBar = () => {
    const router = useRouter();
    const currentPath = router.path;

    // 导航项数据（不再包含图标路径）
    const tabBarItems: TabBarItem[] = [
        {
            key: 'intro',
            text: '介绍',
            pagePath: '/pages/intro/index'
        },
        {
            key: 'progress',
            text: '进度',
            pagePath: '/pages/progress/index'
        },
        {
            key: 'profile',
            text: '个人',
            pagePath: '/pages/profile/index'
        }
    ];

    // 判断是否为当前选中项
    const isActive = (pagePath: string) => {
        return currentPath === pagePath;
    };

    // 处理导航点击
    const handleNavClick = (pagePath: string) => {
        if (currentPath === pagePath) return;
        Taro.switchTab({ url: pagePath });
    };

    return (
        <View className="bottom-tab-bar">
            {tabBarItems.map(item => (
                <View
                    key={item.key}
                    className={`tab-bar-item ${isActive(item.pagePath) ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.pagePath)}
                >
                    <Text className="tab-text">{item.text}</Text>
                </View>
            ))}
        </View>
    );
};

export default BottomTabBar;