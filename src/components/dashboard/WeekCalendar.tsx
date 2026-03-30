import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Gift } from 'lucide-react';
import { getWeekDates, formatDate, getTodayString } from '../../lib/utils';
import type { Task, PokemonCollection } from '../../types';

interface WeekCalendarProps {
  currentWeek: Date;
  onChangeWeek: (direction: number) => void;
  tasks: Task[];
  collections: PokemonCollection[];
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export default function WeekCalendar({ 
  currentWeek, 
  onChangeWeek, 
  tasks, 
  collections 
}: WeekCalendarProps) {
  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);
  const today = getTodayString();

  const getDayData = (date: string) => {
    const dayTasks = tasks.filter(t => t.date === date);
    const completedTasks = dayTasks.filter(t => t.completed).length;
    const totalTasks = dayTasks.length;
    const hasCollection = collections.some(c => c.date === date);
    
    return {
      totalTasks,
      completedTasks,
      allCompleted: totalTasks > 0 && completedTasks === totalTasks,
      hasCollection,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      {/* 导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onChangeWeek(-7)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        
        <h3 className="text-lg font-bold text-gray-800">
          {new Date(weekDates[0]).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} - 
          {new Date(weekDates[6]).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </h3>
        
        <button
          onClick={() => onChangeWeek(7)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>

      {/* 周历 */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const data = getDayData(date);
          const isToday = date === today;
          
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative rounded-xl p-2 text-center cursor-pointer
                transition-all duration-200
                ${isToday ? 'ring-2 ring-pokemon-blue ring-offset-2' : ''}
                ${data.allCompleted && data.totalTasks > 0 
                  ? 'bg-gradient-to-b from-green-50 to-green-100' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              {/* 星期 */}
              <p className="text-xs text-gray-500 mb-1">{WEEKDAYS[index]}</p>
              
              {/* 日期 */}
              <p className={`
                text-lg font-bold mb-1
                ${isToday ? 'text-pokemon-blue' : 'text-gray-800'}
              `}>
                {new Date(date).getDate()}
              </p>

              {/* 状态图标 */}
              <div className="h-6 flex items-center justify-center">
                {data.hasCollection ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-500"
                  >
                    <Gift size={18} />
                  </motion.div>
                ) : data.totalTasks > 0 ? (
                  data.allCompleted ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : (
                    <div className="relative">
                      <Circle size={18} className="text-gray-300" />
                      <div 
                        className="absolute inset-0 rounded-full bg-pokemon-blue/20"
                        style={{ 
                          clipPath: `inset(${100 - data.completionRate}% 0 0 0)` 
                        }}
                      />
                    </div>
                  )
                ) : (
                  <span className="text-gray-300 text-xs">-</span>
                )}
              </div>

              {/* 任务数量 */}
              {data.totalTasks > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {data.completedTasks}/{data.totalTasks}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300" />
          <span>已完成</span>
        </div>
        <div className="flex items-center gap-1">
          <Gift size={12} className="text-yellow-500" />
          <span>已收集</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300" />
          <span>今天</span>
        </div>
      </div>
    </div>
  );
}
