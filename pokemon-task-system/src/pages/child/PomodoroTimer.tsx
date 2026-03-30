import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, CheckCircle, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface PomodoroTimerProps {
  taskTitle: string;
  initialMinutes: number;
  onComplete: () => void;
  onTaskComplete: () => void;
  onClose: () => void;
}

const TIME_OPTIONS = [1, 5, 10, 15];

export default function PomodoroTimer({ 
  taskTitle, 
  initialMinutes, 
  onComplete, 
  onTaskComplete,
  onClose 
}: PomodoroTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(true);

  // 当选择时间后，更新时间
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes, isRunning, isCompleted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setShowTimeSelector(false);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setIsCompleted(false);
  };

  const handleTimeChange = (delta: number) => {
    const newMinutes = Math.max(1, Math.min(60, selectedMinutes + delta));
    setSelectedMinutes(newMinutes);
  };

  // 计算进度百分比
  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-white to-purple-50"
    >
      {/* 顶部栏 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <X size={24} className="text-gray-600" />
        </button>
        
        <div className="w-12" /> {/* 占位 */}
      </div>

      <AnimatePresence mode="wait">
        {showTimeSelector && !isRunning && !isCompleted ? (
          /* 时间选择界面 */
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            {/* 任务标题 */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-8 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">✏️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{taskTitle}</h2>
              <p className="text-gray-500 mt-2">选择专注时间</p>
            </motion.div>

            {/* 时间选择器 */}
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => handleTimeChange(-1)}
                className="p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              
              <div className="text-center">
                <span className="text-6xl font-bold text-pink-500">{selectedMinutes}</span>
                <p className="text-gray-500 mt-2">分钟</p>
              </div>
              
              <button
                onClick={() => handleTimeChange(1)}
                className="p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>

            {/* 快速选择 */}
            <div className="flex gap-3 mb-8 flex-wrap justify-center">
              {[1, 5, 10, 15].map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedMinutes(min)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedMinutes === min
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  {min}分钟
                </button>
              ))}
            </div>

            {/* 开始按钮 */}
            <button
              onClick={handleStart}
              className="px-12 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-pink-500 hover:to-pink-600 transition-all flex items-center gap-3"
            >
              <Play size={28} fill="white" />
              开始专注
            </button>
          </motion.div>
        ) : isCompleted ? (
          /* 完成界面 */
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles size={64} className="text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">专注完成！</h2>
            <p className="text-gray-500 text-lg mb-8">你太棒了！继续保持！</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setShowTimeSelector(true);
                  setTimeLeft(selectedMinutes * 60);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                再专注一次
              </button>
              <button
                onClick={onTaskComplete}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <CheckCircle size={24} />
                完成并打卡
              </button>
            </div>
          </motion.div>
        ) : (
          /* 倒计时界面 */
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-6"
          >
            {/* 任务标题 */}
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-2xl">✏️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{taskTitle}</h2>
            </div>

            {/* 大倒计时 */}
            <div className="relative mb-12">
              {/* 进度圆环 */}
              <svg className="w-72 h-72 transform -rotate-90">
                {/* 背景圆 */}
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="#FEE2E2"
                  strokeWidth="12"
                />
                {/* 进度圆 */}
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 130}`}
                  strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* 时间显示 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-bold text-pink-500">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-gray-400 mt-2">/{selectedMinutes}分钟</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex gap-4">
              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all"
                >
                  <Pause size={28} className="text-white" fill="white" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsRunning(true)}
                    className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </button>
                  {/* 暂停时显示完成按钮 */}
                  <button
                    onClick={() => setIsCompleted(true)}
                    className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <CheckCircle size={28} className="text-white" />
                  </button>
                </>
              )}

              <button
                onClick={handleReset}
                className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-300 transition-all"
              >
                <RotateCcw size={24} className="text-gray-600" />
              </button>
            </div>

            {/* 鼓励语 */}
            <p className="mt-8 text-pink-500 font-medium text-lg">
              {isRunning ? '专注中...加油！💪' : isCompleted ? '点击完成打卡！👆' : '点击开始专注吧！🌟'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
