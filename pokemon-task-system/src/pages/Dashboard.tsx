import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import WeekCalendar from '../components/dashboard/WeekCalendar';
import StatsChart from '../components/dashboard/StatsChart';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useCollections } from '../hooks/useCollections';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks(user?.uid);
  const { collections } = useCollections(user?.uid);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const changeWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction);
    setCurrentWeek(newWeek);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">数据统计</h1>
        <p className="text-gray-500">查看你的任务完成情况</p>
      </div>

      {/* 周历 */}
      <WeekCalendar
        currentWeek={currentWeek}
        onChangeWeek={changeWeek}
        tasks={tasks}
        collections={collections}
      />

      {/* 统计数据 */}
      <StatsChart tasks={tasks} collections={collections} />

      {/* 提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <TrendingUp className="text-pokemon-blue" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">小贴士</h4>
            <p className="text-sm text-gray-600">
              坚持完成任务可以收集更多宝可梦！每天完成所有任务可以获得一个精灵球，
              开启后随机获得一只宝可梦。
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
