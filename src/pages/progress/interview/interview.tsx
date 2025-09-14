import { View, Text, Button, Picker } from '@tarojs/components';
import { FC, useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './interview.scss';
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';
import { InterviewTime } from "../../../api/types";
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviewTimes } from "../../../store/interviewSlice";
import { RootState } from '../../../store/index'; // 假设你有 RootState 类型定义

// 定义处理后的数据类型（适配页面展示）
interface ProcessedInterviewData {
    interviewDate: string;
    times: Array<{
        interviewTime: string;
        interviewNumber: number;
        interviewCurrentNumber: number;
        id: string; // 用于预约接口传递ID
    }>;
}

const Interview: FC = () => {
    // 状态管理
    const [interviewData, setInterviewData] = useState<ProcessedInterviewData[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<{
        interviewTime: string;
        interviewNumber: number;
        interviewCurrentNumber: number;
        id: string;
    } | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(true); // 加载状态(loading 是状态的当前值，setLoading 是用于更新 loading 状态的函数)
    const [errorMsg, setErrorMsg] = useState<string>(''); // 错误提示
    const dispatch = useDispatch();
    const interviewTimes = useSelector((state: RootState) => state.interview.times);
    // 页面加载时获取数据（实际项目中替换为接口请求）
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log('开始获取面试时间数据');
                const resultAction = await dispatch(fetchInterviewTimes() as any);

                console.log('Redux action 结果:', resultAction);

                if (fetchInterviewTimes.fulfilled.match(resultAction)) {
                    console.log('原始接口数据:', resultAction.payload);
                    const processedData = processRawInterviewData(resultAction.payload);
                    console.log('处理后的数据:', processedData);
                    setInterviewData(processedData);
                } else {
                    console.error('获取数据失败:', resultAction.error);
                    setErrorMsg('获取数据失败');
                }
            } catch (error) {
                console.error('异常:', error);
                setErrorMsg(error instanceof Error ? error.message : '获取数据失败');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    // 3. 处理原始接口数据：转换为页面展示格式
    const processRawInterviewData = (rawData: InterviewTime[]): ProcessedInterviewData[] => {
        // 按日期分组
        const dateMap = new Map<string, ProcessedInterviewData['times']>();

        rawData.forEach(item => {
            // 格式化日期（去除时间部分，仅保留YYYY-MM-DD）
            const interviewDate = item.appointmentDate.split('T')[0];
            // 格式化时间范围（HH:mm-HH:mm）
            const startTime = formatTime(item.startTime);
            const endTime = formatTime(item.endTime);
            const interviewTime = `${startTime}-${endTime}`;

            // 转换字符串数值为数字（确保计算正确）
            const interviewNumber = parseInt(item.capacity, 10) || 0;
            const interviewCurrentNumber = parseInt(item.appointedCount, 10) || 0;

            // 按日期分组存储
            if (!dateMap.has(interviewDate)) {
                dateMap.set(interviewDate, []);
            }
            dateMap.get(interviewDate)?.push({
                interviewTime,
                interviewNumber,
                interviewCurrentNumber,
                id: item.id // 保留接口返回的ID，用于后续预约
            });
        });

        // 转换为数组格式
        return Array.from(dateMap.entries()).map(([interviewDate, times]) => ({
            interviewDate,
            times
        }));
    };

    // 辅助函数：格式化时间（将ISO格式转换为HH:mm）
    const formatTime = (isoTime: string): string => {
        const date = new Date(isoTime);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 返回上一页
    const handleGoBack = () => {
        Taro.navigateBack();
    };

    // 选择日期
    const handleDateSelect = (e: any) => {
        const index = Number(e.detail.value);
        if (interviewData[index]) {
            setSelectedDate(interviewData[index].interviewDate);
            setSelectedTime(null);
        }
    };

    // 选择时间
    const handleTimeSelect = (time: typeof selectedTime) => {
        setSelectedTime(time);
    };

    // 显示确认弹窗（需同时选中日期和时间）
    const handleShowConfirm = () => {
        if (selectedDate && selectedTime) {
            setShowConfirmModal(true);
        } else {
            Taro.showToast({
                title: '请先选择日期和时间',
                icon: 'none',
                duration: 1500
            });
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
    const getRemaining = (time: typeof selectedTime) => {
        if (!time) return 0; //因为time可能为null
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

            {/* 加载状态 */}
            {loading && (
                <View className="loading-state">
                    <Text>加载中...</Text>
                </View>
            )}

            {/* 错误状态 */}
            {errorMsg && (
                <View className="error-state">
                    <Text>{errorMsg}</Text>
                    <Button onClick={() => window.location.reload()}>重试</Button>
                </View>
            )}

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
            {/* 空数据状态 */}
            {!loading && !errorMsg && interviewData.length === 0 && (
                <View className="empty-state">
                    <Text>暂无可用面试时间</Text>
                </View>
            )}
        </View>
    );
};

export default Interview;