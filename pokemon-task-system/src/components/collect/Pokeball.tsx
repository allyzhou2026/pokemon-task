import { motion } from 'framer-motion';

interface PokeballProps {
  onClick: () => void;
  disabled?: boolean;
  isCollected?: boolean;
  animate?: boolean;
}

export default function Pokeball({ 
  onClick, 
  disabled = false, 
  isCollected = false,
  animate = false 
}: PokeballProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={animate ? {
        rotate: [0, -15, 15, -15, 15, -5, 5, 0],
        scale: [1, 1.05, 1.05, 1.05, 1.05, 1.02, 1.02, 1],
      } : {}}
      transition={animate ? {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 0.5,
      } : {}}
      className={`
        relative w-32 h-32 rounded-full overflow-hidden
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${isCollected ? 'animate-float' : ''}
      `}
      style={{
        background: 'linear-gradient(to bottom, #FF0000 0%, #FF0000 48%, #000000 48%, #000000 52%, #FFFFFF 52%, #FFFFFF 100%)',
        boxShadow: isCollected 
          ? '0 8px 32px rgba(255, 215, 0, 0.5)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 中间黑条 */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-black transform -translate-y-1/2" />
      
      {/* 中间按钮 */}
      <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full border-4 border-black transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
        <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300" />
      </div>

      {/* 高光效果 */}
      <div className="absolute top-4 left-4 w-6 h-3 bg-white/30 rounded-full transform -rotate-45" />
      
      {/* 闪光效果 */}
      {isCollected && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 40px rgba(255, 215, 0, 0.6)',
              '0 0 20px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
}
