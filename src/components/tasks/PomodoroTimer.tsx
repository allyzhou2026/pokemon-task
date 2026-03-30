import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../types';

interface PomodoroTimerProps {
  task: Task;
  onClose: () => void;
  onComplete: () => void;
}

export default function PomodoroTimer({ 
  task, 
  onClose, 
  onComplete 
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(task.pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.pomodoroCompleted);

  const totalTime = task.pomodoroMinutes * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

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

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(task.pomodoroMinutes * 60);
    setIsCompleted(false);
  };

  // 如果没有设置番茄钟时间
  if (task.pomodoroMinutes === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-6xl mb-4">⏱️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">未设置番茄钟</h3>
          <p className="text-gray-500 mb-4">
            这个任务没有设置番茄钟时间。
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            知道了
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* 标题 */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          番茄钟
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6 truncate px-4">
          {task.title}
        </p>

        {/* 完成状态 */}
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
              </motion.div>
              <h4 className="text-2xl font-bold text-green-600 mb-2">完成！</h4>
              <p className="text-gray-500">番茄钟计时结束</p>
            </motion.div>
          ) : (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* 圆形进度条 */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  {/* 背景圆 */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                  />
                  {/* 进度圆 */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    className="transition-all duration-1000"
                  />
                  {/* 渐变定义 */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#4ECDC4" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* 时间显示 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    / {task.pomodoroMinutes}分钟
                  </span>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex justify-center gap-4">
                {isRunning ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    <Pause size={20} />
                    暂停
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    <Play size={20} />
                    {timeLeft === totalTime ? '开始' : '继续'}
                  </button>
                )}
                
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw size={20} />
                  重置
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
