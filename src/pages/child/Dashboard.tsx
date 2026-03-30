import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useCollections } from '../../hooks/useCollections';
import { getTodayString, getWeekDates } from '../../lib/utils';

export default function ChildDashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks(user?.uid);
  const { collections } = useCollections(user?.uid);

  // 计算统计数据
  const today = getTodayString();
  const weekDates = getWeekDates();

  const todayTasks = tasks.filter(t => t.date === today);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const todayTotal = todayTasks.length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weekTasks = tasks.filter(t => weekDates.includes(t.date));
  const weekCompleted = weekTasks.filter(t => t.completed).length;
  const weekTotal = weekTasks.length;

  const uniquePokemonCount = new Set(collections.map(c => c.pokemonId)).size;

  // 连续完成天数
  let streak = 0;
  const sortedDates = [...new Set(collections.map(c => c.date))].sort().reverse();
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 pb-4"
    >
      {/* 鼓励卡片 - 紧凑 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3 text-center"
      >
        <p className="text-base font-bold text-gray-800">加油！你是最棒的！</p>
        <p className="text-xs text-gray-600">每天完成任务，收集更多宝可梦！</p>
      </motion.div>

      {/* 统计卡片 - 2x2紧凑布局 */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-xl p-3 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">今日任务</p>
            <p className="text-lg font-bold text-gray-800">{todayCompleted}/{todayTotal}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-green-50 rounded-xl p-3 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">完成率</p>
            <p className="text-lg font-bold text-gray-800">{completionRate}%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 rounded-xl p-3 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">收集宝可梦</p>
            <p className="text-lg font-bold text-gray-800">{uniquePokemonCount}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-purple-50 rounded-xl p-3 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">连续天数</p>
            <p className="text-lg font-bold text-gray-800">{streak}天</p>
          </div>
        </motion.div>
      </div>

      {/* 进度条 - 紧凑 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-3 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">本周完成</span>
          <span className="text-xs text-gray-500">{weekCompleted}/{weekTotal}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">图鉴收集</span>
          <span className="text-xs text-gray-500">{uniquePokemonCount}/151</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(uniquePokemonCount / 151) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* 小贴士 - 紧凑 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3"
      >
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-800">💡 小贴士：</span>
          使用番茄钟可以更专注地完成任务哦！
        </p>
      </motion.div>
    </motion.div>
  );
}
