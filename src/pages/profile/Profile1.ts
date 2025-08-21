// 定义视图组件接收的属性类型
export interface ProProps {
    onGoToRegistration: () => void;
    onGoToNotifications: () => void;
    onGoToContact: () => void;
}

// 定义图片组件的属性类型
export interface ImageProps {
    src?: string; // 让 src 变为可选
    className: string;
}
