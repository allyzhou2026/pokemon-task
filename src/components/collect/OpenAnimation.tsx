import { motion } from 'framer-motion';

interface OpenAnimationProps {
  onComplete: () => void;
}

export default function OpenAnimation({ onComplete }: OpenAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 闪光背景 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at center, white 0%, transparent 0%)',
            'radial-gradient(circle at center, white 30%, transparent 70%)',
            'radial-gradient(circle at center, white 50%, transparent 100%)',
            'radial-gradient(circle at center, white 70%, transparent 100%)',
          ],
        }}
        transition={{ duration: 1.5, times: [0, 0.3, 0.6, 1] }}
        onAnimationComplete={onComplete}
      />

      {/* 精灵球打开动画 */}
      <div className="relative">
        {/* 上半部分 - 向上飞 */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-32 h-16 overflow-hidden"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ y: 0 }}
          animate={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div 
            className="w-32 h-32 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #FF0000 0%, #CC0000 100%)',
            }}
          />
        </motion.div>

        {/* 下半部分 - 向下飞 */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-16 overflow-hidden"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ y: 0 }}
          animate={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div 
            className="w-32 h-32 rounded-full -mt-16"
            style={{
              background: 'linear-gradient(to bottom, #FFFFFF 0%, #EEEEEE 100%)',
            }}
          />
        </motion.div>

        {/* 中间按钮 */}
        <motion.div
          className="w-10 h-10 bg-white rounded-full border-4 border-black z-20"
          initial={{ scale: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* 星星粒子效果 */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-4 h-4"
            style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{
              scale: [0, 1.5, 0],
              x: `${Math.cos((i * 45 * Math.PI) / 180) * 100 - 50}%`,
              y: `${Math.sin((i * 45 * Math.PI) / 180) * 100 - 50}%`,
              rotate: 360,
            }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
