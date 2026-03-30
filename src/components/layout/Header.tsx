import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import type { UserRole } from '../../types';

interface HeaderProps {
  role: UserRole;
  onSwitchRole: () => void;
}

export default function Header({ role, onSwitchRole }: HeaderProps) {
  const roleText = role === 'parent' ? '家长端' : '宝贝端';
  const roleColor = role === 'parent' ? 'bg-blue-500' : 'bg-pink-500';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              className="relative"
            >
              <div className="pokeball w-6 h-6" />
            </motion.div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pokemon-red to-pokemon-blue bg-clip-text text-transparent">
              宝可梦任务
            </h1>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`ml-2 px-2 py-0.5 ${roleColor} text-white text-xs font-medium rounded-full shadow-sm`}
            >
              {roleText}
            </motion.span>
          </motion.div>

          {/* Actions */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSwitchRole}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            title="切换身份"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw size={14} />
            </motion.div>
            <span className="hidden sm:inline font-medium">切换</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
