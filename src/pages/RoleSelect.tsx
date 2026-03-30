import { motion } from 'framer-motion';
import { UserCircle, Baby } from 'lucide-react';
import type { UserRole } from '../types';

interface RoleSelectProps {
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelect({ onSelectRole }: RoleSelectProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="pokeball w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pokemon-red to-pokemon-blue bg-clip-text text-transparent mb-2">
          宝可梦任务
        </h1>
        <p className="text-gray-500">请选择您的身份</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        {/* 家长端 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('parent')}
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UserCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">家长端</h2>
          <p className="text-gray-500 text-sm">布置任务、管理主题</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">设置主题</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">布置任务</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">语音输入</span>
          </div>
        </motion.button>

        {/* 宝贝端 */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('child')}
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Baby size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">宝贝端</h2>
          <p className="text-gray-500 text-sm">查看任务、收集宝可梦</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">完成任务</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">番茄钟</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs">收集精灵</span>
          </div>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-gray-400 text-sm"
      >
        儿童友好的任务积分兑换系统
      </motion.p>
    </div>
  );
}
