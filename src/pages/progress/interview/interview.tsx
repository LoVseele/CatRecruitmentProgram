import { View, Text, Button, Picker } from '@tarojs/components';
import { FC, useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './interview.scss';
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';

// 模拟面试时间数据
const mockInterviewData = [
    {
        interviewDate: '2025-09-01',
        times: [
            {
                interviewTime: '10:00-11:00',
                interviewNumber: 3,
                interviewCurrentNumber: 1,
            },
            {
                interviewTime: '14:00-15:00',
                interviewNumber: 3,
                interviewCurrentNumber: 3,
            },
        ],
    },
    {
        interviewDate: '2025-09-02',
        times: [
            {
                interviewTime: '09:30-10:30',
                interviewNumber: 3,
                interviewCurrentNumber: 0,
            },
            {
                interviewTime: '15:30-16:30',
                interviewNumber: 3,
                interviewCurrentNumber: 2,
            },
        ],
    },
];

// 定义时间类型
interface TimeItem {
    interviewTime: string;
    interviewNumber: number;
    interviewCurrentNumber: number;
}

const Interview: FC = () => {
    // 状态管理
    const [interviewData, setInterviewData] = useState(mockInterviewData);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<TimeItem | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 页面加载时获取数据（实际项目中替换为接口请求）
    useEffect(() => {
        // Taro.request({
        //   url: '你的接口地址',
        //   method: 'GET',
        //   success: (res) => {
        //     setInterviewData(res.data.data);
        //   }
        // });
    }, []);

    // 返回上一页
    const handleGoBack = () => {
        Taro.navigateBack();
    };

    // 选择日期
    const handleDateSelect = (e: any) => {
        const index = e.detail.value;
        const selected = interviewData[index].interviewDate;
        setSelectedDate(selected);
        setSelectedTime(null); // 重置时间选择
    };

    // 选择时间
    const handleTimeSelect = (time: TimeItem) => {
        setSelectedTime(time);
    };

    // 显示确认弹窗
    const handleShowConfirm = () => {
        if (selectedDate && selectedTime) {
            setShowConfirmModal(true);
        }
    };

    // 取消预约
    const handleCancel = () => {
        setShowConfirmModal(false);
    };

    // 确认预约
    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            // 调用预约接口的逻辑
            Taro.showToast({
                title: '预约成功',
                icon: 'success',
                duration: 2000
            });
            setShowConfirmModal(false);
            // 可以在这里重置选择或跳转页面
            // setSelectedDate('');
            // setSelectedTime(null);
        }
    };

    // 计算剩余人数
    const getRemaining = (time: TimeItem) => {
        return time.interviewNumber - time.interviewCurrentNumber;
    };

    return (
        <View className="interview-page">
            {/* 页面头部 */}
            <View className="page-header">
                <Button className="back-btn iconfont" onClick={handleGoBack}>
                    &#xe632;
                </Button>
                <Text className="title">预约面试时间</Text>
            </View>

            {/* 主要内容区 */}
            <View className="interview-content">
                {/* 日期选择 */}
                <View className="date-selector">
                    <Text className="form-label">选择日期</Text>
                    <Picker
                        range={interviewData.map(item => item.interviewDate)}
                        onChange={handleDateSelect}
                    >
                        <View className="picker-display">
                            {selectedDate || '请选择日期'}
                            <Text className="iconfont arrow-icon">&#xe602;</Text>
                        </View>
                    </Picker>
                </View>

                {/* 时间选择列表 */}
                {selectedDate && (
                    <View className="time-selector">
                        <Text className="form-label">选择时间</Text>
                        <View className="time-list">
                            {interviewData
                                .find(item => item.interviewDate === selectedDate)
                                ?.times.map((time, index) => {
                                    const remaining = getRemaining(time);
                                    const isSelected = selectedTime?.interviewTime === time.interviewTime;

                                    return (
                                        <View
                                            key={index}
                                            className={`time-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleTimeSelect(time)}
                                        >
                                            <View className="time-info">
                                                <Text className="time-text">{time.interviewTime}</Text>
                                                <Text className="remaining-text">
                                                    剩余 {remaining} 人
                                                </Text>
                                            </View>

                                            {/* 仅当有剩余名额时显示选择按钮 */}
                                            {remaining > 0 && (
                                                <Button className="select-btn">选择</Button>
                                            )}
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                )}

                {/* 确认预约按钮 */}
                {selectedTime && getRemaining(selectedTime) > 0 && (
                    <Button
                        className="confirm-btn"
                        onClick={handleShowConfirm}
                    >
                        确认预约
                    </Button>
                )}
            </View>

            {/* 确认弹窗  */}
            {showConfirmModal && (
                <View className="custom-modal-overlay">
                    <View className="custom-modal">
                        <View className="modal-header">
                            <Text className="modal-title">确认预约</Text>
                        </View>

                        <View className="modal-body">
                            {selectedDate && (
                                <View className="modal-info">
                                    <Text className="info-label">日期：</Text>
                                    <Text>{selectedDate}</Text>
                                </View>
                            )}

                            {selectedTime && (
                                <>
                                    <View className="modal-info">
                                        <Text className="info-label">时间：</Text>
                                        <Text>{selectedTime.interviewTime}</Text>
                                    </View>
                                    <View className="modal-info">
                                        <Text className="info-label">剩余人数：</Text>
                                        <Text>{getRemaining(selectedTime)}</Text>
                                    </View>
                                </>
                            )}
                        </View>

                        <View className="modal-footer">
                            <Button className="modal-btn cancel-btn" onClick={handleCancel}>
                                取消
                            </Button>
                            <Button className="modal-btn confirm-btn" onClick={handleConfirm}>
                                确认
                            </Button>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Interview;
