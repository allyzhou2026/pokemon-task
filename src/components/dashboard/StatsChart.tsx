import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Zap, Calendar } from 'lucide-react';
import type { Task, PokemonCollection } from '../../types';
import { getTodayString, getWeekDates } from '../../lib/utils';

interface StatsChartProps {
  tasks: Task[];
  collections: PokemonCollection[];
}

export default function StatsChart({ tasks, collections }: StatsChartProps) {
  const today = getTodayString();
  const weekDates = getWeekDates();

  const stats = useMemo(() => {
    // 总任务数
    const totalTasks = tasks.length;
    
    // 已完成任务数
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // 完成率
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    // 本周任务
    const weekTasks = tasks.filter(t => weekDates.includes(t.date));
    const weekCompleted = weekTasks.filter(t => t.completed).length;
    
    // 今日任务
    const todayTasks = tasks.filter(t => t.date === today);
    const todayCompleted = todayTasks.filter(t => t.completed).length;
    const todayTotal = todayTasks.length;
    
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

    return {
      totalTasks,
      completedTasks,
      completionRate,
      weekCompleted,
      weekTotal: weekTasks.length,
      todayCompleted,
      todayTotal,
      collectionCount: collections.length,
      uniquePokemonCount: new Set(collections.map(c => c.pokemonId)).size,
      streak,
    };
  }, [tasks, collections, today, weekDates]);

  const statCards = [
    {
      icon: Target,
      label: '今日任务',
      value: `${stats.todayCompleted}/${stats.todayTotal}`,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Zap,
      label: '完成率',
      value: `${stats.completionRate}%`,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Trophy,
      label: '收集宝可梦',
      value: `${stats.uniquePokemonCount}`,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Calendar,
      label: '连续天数',
      value: `${stats.streak}天`,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} rounded-2xl p-4`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">本周完成情况</h4>
          <span className="text-sm text-gray-500">
            {stats.weekCompleted}/{stats.weekTotal} 任务
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.weekTotal > 0 ? (stats.weekCompleted / stats.weekTotal) * 100 : 0}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
          />
        </div>

        {/* 收集进度 */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <h4 className="font-semibold text-gray-800">图鉴收集进度</h4>
          <span className="text-sm text-gray-500">
            {stats.uniquePokemonCount}/151
          </span>
        </div>
        
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.uniquePokemonCount / 151) * 100}%` }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
