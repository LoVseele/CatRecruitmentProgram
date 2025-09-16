import { View, Text, Button, Picker } from '@tarojs/components';
import { FC, useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './interview.scss';
import '../../../assets/font_5005005_riasjpvkzb/iconfont.css';
import { InterviewTime } from "../../../api/types";
import { getAllInterviewTime } from "../../../api/index";
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviewTimes } from "../../../store/interviewSlice";
import { RootState } from '../../../store/index';

// 定义处理后的数据类型
interface ProcessedInterviewData {
  interviewDate: string;
  times: Array<{
    interviewTime: string;
    interviewNumber: number;
    interviewCurrentNumber: number;
    id: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 页面加载时获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getAllInterviewTime();
        console.log('API响应:', response);
        // 检查响应结构
        if (response && response.code === 200 && response.data) {
          const processedData = processRawInterviewData(response.data);
          setInterviewData(processedData);
          setErrorMsg('');
        } else {
          console.error('API响应格式错误:', response);
          setErrorMsg('数据格式错误，请稍后重试');
        }
      } catch (error) {
        console.error('获取数据异常:', error);
        setErrorMsg(error instanceof Error ? error.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 处理原始接口数据
  const processRawInterviewData = (rawData: any[]): ProcessedInterviewData[] => {
    const dateMap = new Map<string, ProcessedInterviewData['times']>();

    rawData.forEach(item => {
      // 格式化日期
      const interviewDate = item.appointmentDate.split('T')[0];

      // 格式化时间范围
      const startTime = formatTime(item.startTime);
      const endTime = formatTime(item.endTime);
      const interviewTime = `${startTime}-${endTime}`;

      // 转换数值
      const interviewNumber = parseInt(item.capacity, 10) || 0;
      const interviewCurrentNumber = parseInt(item.appointedCount, 10) || 0;

      if (!dateMap.has(interviewDate)) {
        dateMap.set(interviewDate, []);
      }

      dateMap.get(interviewDate)?.push({
        interviewTime,
        interviewNumber,
        interviewCurrentNumber,
        id: item.id.toString(),
      });
    });

    // 按日期排序
    return Array.from(dateMap.entries())
      .map(([interviewDate, times]) => ({
        interviewDate,
        times: times.sort((a, b) => a.interviewTime.localeCompare(b.interviewTime))
      }))
      .sort((a, b) => a.interviewDate.localeCompare(b.interviewDate));
  };

  // 辅助函数：格式化时间
  const formatTime = (isoTime: string): string => {
    try {
      const date = new Date(isoTime);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('时间格式化错误:', isoTime, error);
      return '00:00';
    }
  };

  // 计算剩余人数
  const getRemaining = (time: typeof selectedTime) => {
    if (!time) return 0;
    return time.interviewNumber - time.interviewCurrentNumber;
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
  const handleTimeSelect = (time: any) => {
    setSelectedTime(time);
  };

  // 显示确认弹窗
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
      // 1. 更新本地状态中的剩余数量（核心修改）
      setInterviewData(prev => prev.map(dateItem => {
        if (dateItem.interviewDate === selectedDate) {
          return {
            ...dateItem,
            times: dateItem.times.map(time => {
              if (time.id === selectedTime.id) {
                // 已预约人数+1，剩余数量会通过getRemaining自动计算减少
                return { ...time, interviewCurrentNumber: time.interviewCurrentNumber + 1 };
              }
              return time;
            })
          };
        }
        return dateItem;
      }));

      console.log('预约信息:', {
        date: selectedDate,
        time: selectedTime,
        id: selectedTime.id
      });

      Taro.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      });
      setShowConfirmModal(false);
    }
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
      {!loading && !errorMsg && interviewData.length > 0 && (
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
              <Text className="form-label">选择时间段</Text>
              <View className="time-list">
                {interviewData
                  .find(item => item.interviewDate === selectedDate)
                  ?.times.map((time, index) => {
                    const remaining = getRemaining(time);
                    const isSelected = selectedTime?.id === time.id;
                    const isFull = remaining <= 0;

                    return (
                      <View
                        key={time.id}
                        className={`time-item ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                        onClick={() => !isFull && handleTimeSelect(time)}
                      >
                        <View className="time-info">
                          <Text className="time-range">{time.interviewTime}</Text>
                          <Text className="remaining-text">
                            {isFull ? '已满员' : ` 剩余 ${remaining} 人`}
                          </Text>
                        </View>

                        {!isFull && (
                          <Button className="select-btn">
                            {isSelected ? '已选择' : '选择'}
                          </Button>
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
      )}

      {/* 空数据状态 */}
      {!loading && !errorMsg && interviewData.length === 0 && (
        <View className="empty-state">
          <Text>暂无可用面试时间</Text>
        </View>
      )}

      {/* 确认弹窗 */}
      {showConfirmModal && selectedTime && (
        <View className="custom-modal-overlay">
          <View className="custom-modal">
            <View className="modal-header">
              <Text className="modal-title">确认预约</Text>
            </View>

            <View className="modal-body">
              <View className="modal-info">
                <Text className="info-label">日期：</Text>
                <Text>{selectedDate}</Text>
              </View>
              <View className="modal-info">
                <Text className="info-label">时间：</Text>
                <Text>{selectedTime.interviewTime}</Text>
              </View>
              <View className="modal-info">
                <Text className="info-label">剩余名额：</Text>
                <Text>{getRemaining(selectedTime)} 人</Text>
              </View>
            </View>

            <View className="modal-footer">
              <Button className="modal-btn cancel-btn" onClick={handleCancel}>
                取消
              </Button>
              <Button className="modal-btn confirm-btn" onClick={handleConfirm}>
                确认预约
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Interview;