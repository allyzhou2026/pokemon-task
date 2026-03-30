import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import type { UserRole } from '../types';

interface WelcomeProps {
  onStart: (role: UserRole) => void;
}

// 简单的音效函数（使用 Web Audio API 生成音效）
const playSound = (type: 'shake' | 'open' | 'success') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'shake') {
      // 摇晃声 - 快速高低音
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'open') {
      // 开球声 - 上升音调
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'success') {
      // 成功声 - 愉快的和弦
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      
      oscillator.start(audioContext.currentTime);
      osc2.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
      osc2.stop(audioContext.currentTime + 0.6);
    }
  } catch (e) {
    console.error('Audio play failed:', e);
  }
};

export default function Welcome({ onStart }: WelcomeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showParentOption, setShowParentOption] = useState(false);

  const handleStartAdventure = () => {
    // 播放摇晃音效
    playSound('shake');
    setIsOpening(true);
    
    // 延迟后播放开球音效和闪光
    setTimeout(() => {
      playSound('open');
      setShowFlash(true);
    }, 1500);
    
    // 最后播放成功音效并进入
    setTimeout(() => {
      playSound('success');
      onStart('child');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity,
              delay: i * 0.5 
            }}
          >
            {['⭐', '✨', '🌟', '💫', '⚡', '🎮'][i]}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isOpening ? (
          /* 欢迎界面 */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center z-10"
          >
            {/* 精灵球 - 放在最上面，放大1.5倍，去掉透明度，颜色加深 */}
            <motion.div
              initial={{ scale: 0, y: -30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 12 }}
              className="mb-6"
            >
              <div className="w-36 h-36 mx-auto relative">
                {/* 精灵球主体 */}
                <div 
                  className="w-full h-full rounded-full shadow-2xl"
                  style={{
                    background: 'linear-gradient(to bottom, #FF0000 0%, #FF0000 48%, #000000 48%, #000000 52%, #FFFFFF 52%, #FFFFFF 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(255,0,0,0.2)',
                  }}
                >
                  {/* 中间按钮 */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full border-4 border-black transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                  >
                    <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-300" />
                  </div>
                  {/* 高光 */}
                  <div className="absolute top-4 left-6 w-8 h-4 bg-white/40 rounded-full transform -rotate-45" />
                </div>
              </div>
            </motion.div>

            {/* 名字 */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-800 mb-2"
            >
              Daniel
            </motion.h1>

            {/* 欢迎语 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-2"
            >
              欢迎来到宝可梦的旅途
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 mb-8"
            >
              完成任务，收集宝可梦，开启你的冒险吧！
            </motion.p>

            {/* 开始按钮 */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartAdventure}
              className="px-10 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              🚀 开始冒险
            </motion.button>

            {/* 家长入口 - 弱化显示 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <button
                onClick={() => setShowParentOption(!showParentOption)}
                className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
              >
                {showParentOption ? '收起' : '家长入口'}
              </button>
              
              <AnimatePresence>
                {showParentOption && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => onStart('parent')}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg mx-auto hover:bg-gray-200 transition-colors"
                  >
                    <UserCircle size={16} />
                    进入家长端
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ) : (
          /* 开球动画界面 */
          <motion.div
            key="opening"
            className="relative z-10 flex flex-col items-center justify-center"
          >
            {/* 精灵球 - 使用与欢迎页面相同的样式，确保居中 */}
            <motion.div
              animate={{
                rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1.05, 1.05, 1.02, 1.02, 1],
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="relative w-36 h-36 mx-auto"
            >
              <div 
                className="w-full h-full rounded-full shadow-2xl"
                style={{
                  background: 'linear-gradient(to bottom, #FF0000 0%, #FF0000 48%, #000000 48%, #000000 52%, #FFFFFF 52%, #FFFFFF 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(255,0,0,0.2)',
                }}
              >
                {/* 中间按钮 */}
                <div 
                  className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full border-4 border-black transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-300" />
                </div>
                {/* 高光 */}
                <div className="absolute top-4 left-6 w-8 h-4 bg-white/40 rounded-full transform -rotate-45" />
              </div>
            </motion.div>

            {/* 闪光效果 */}
            <AnimatePresence>
              {showFlash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 3 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-64 h-64 bg-white rounded-full blur-3xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 星星粒子 */}
            <AnimatePresence>
              {showFlash && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                        y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 0.8 }}
                      className="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3"
                    >
                      <div className="w-full h-full bg-yellow-400 rounded-full shadow-lg" 
                        style={{ 
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                        }}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* 加载文字 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center mt-8 text-pink-500 font-bold text-lg"
            >
              正在进入宝可梦世界...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
