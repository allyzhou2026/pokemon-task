import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubjects } from '../../hooks/useSubjects';
import { useTasks } from '../../hooks/useTasks';
import { useCollections } from '../../hooks/useCollections';
import { getWeekDates, formatDate, getTodayString } from '../../lib/utils';
import PageTransition, { StaggerContainer, StaggerItem } from '../../components/ui/PageTransition';

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function ParentOverview() {
  const { user } = useAuth();
  const { subjects } = useSubjects(user?.uid);
  const { tasks, getTasksByDate } = useTasks(user?.uid);
  const { collections } = useCollections(user?.uid);
  
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const weekDates = getWeekDates(currentWeek);
  const today = getTodayString();

  const changeWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const getDayData = (date: string) => {
    const dayTasks = getTasksByDate(date);
    const completedTasks = dayTasks.filter(t => t.completed).length;
    const hasCollection = collections.some(c => c.date === date);
    
    const tasksBySubject = subjects.map(subject => ({
      subject,
      tasks: dayTasks.filter(t => t.subjectId === subject.id),
      completed: dayTasks.filter(t => t.subjectId === subject.id && t.completed).length,
    })).filter(g => g.tasks.length > 0);
    
    return {
      totalTasks: dayTasks.length,
      completedTasks,
      allCompleted: dayTasks.length > 0 && completedTasks === dayTasks.length,
      hasCollection,
      completionRate: dayTasks.length > 0 ? Math.round((completedTasks / dayTasks.length) * 100) : 0,
      tasksBySubject,
    };
  };

  const weekStats = weekDates.map(date => getDayData(date));
  const totalWeekTasks = weekStats.reduce((sum, day) => sum + day.totalTasks, 0);
  const totalWeekCompleted = weekStats.reduce((sum, day) => sum + day.completedTasks, 0);
  const weekCompletionRate = totalWeekTasks > 0 ? Math.round((totalWeekCompleted / totalWeekTasks) * 100) : 0;
  const weekCollections = weekStats.filter(day => day.hasCollection).length;

  const selectedDayData = selectedDate ? getDayData(selectedDate) : null;

  return (
    <PageTransition className="space-y-4">
      {/* 本周统计卡片 */}
      <StaggerContainer className="grid grid-cols-3 gap-3" staggerDelay={0.1}>
        <StaggerItem className="bg-blue-50 rounded-2xl p-4 text-center card-interactive">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          </motion.div>
          <p className="text-2xl font-bold text-blue-700">{weekCompletionRate}%</p>
          <p className="text-sm text-blue-600">完成率</p>
        </StaggerItem>

        <StaggerItem className="bg-green-50 rounded-2xl p-4 text-center card-interactive">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          </motion.div>
          <p className="text-2xl font-bold text-green-700">{totalWeekCompleted}/{totalWeekTasks}</p>
          <p className="text-sm text-green-600">任务完成</p>
        </StaggerItem>

        <StaggerItem className="bg-yellow-50 rounded-2xl p-4 text-center card-interactive">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-8 h-8 mx-auto mb-2 text-yellow-500 text-2xl"
          >
            ⭐
          </motion.div>
          <p className="text-2xl font-bold text-yellow-700">{weekCollections}/7</p>
          <p className="text-sm text-yellow-600">收集天数</p>
        </StaggerItem>
      </StaggerContainer>

      {/* 周历 */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <h3 className="text-lg font-bold text-gray-800">
            {new Date(weekDates[0]).getMonth() + 1}月{new Date(weekDates[0]).getDate()}日 - 
            {new Date(weekDates[6]).getMonth() + 1}月{new Date(weekDates[6]).getDate()}日
          </h3>
          
          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const data = getDayData(date);
            const isToday = date === today;
            const isSelected = date === selectedDate;
            
            return (
              <motion.button
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDate(date === selectedDate ? null : date)}
                className={`
                  relative rounded-xl p-3 text-center transition-all duration-200
                  ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                  ${isToday ? 'bg-blue-50' : 'bg-gray-50'}
                  ${data.allCompleted && data.totalTasks > 0 ? 'bg-green-50' : ''}
                  hover:shadow-md
                `}
              >
                <p className="text-xs text-gray-500 mb-1">{WEEKDAYS[index]}</p>
                <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                  {new Date(date).getDate()}
                </p>
                
                <div className="h-6 flex items-center justify-center mt-1">
                  {data.totalTasks > 0 ? (
                    data.allCompleted ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <div className="relative">
                        <Circle size={18} className="text-gray-300" />
                        <div 
                          className="absolute inset-0 rounded-full bg-blue-400/30"
                          style={{ clipPath: `inset(${100 - data.completionRate}% 0 0 0)` }}
                        />
                      </div>
                    )
                  ) : (
                    <span className="text-gray-300 text-xs">-</span>
                  )}
                </div>

                {data.totalTasks > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {data.completedTasks}/{data.totalTasks}
                  </p>
                )}

                {isToday && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300" />
            <span>全部完成</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300" />
            <span>今天</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300" />
            <span>有任务</span>
          </div>
        </div>
      </div>

      {/* 选中日期的详情 */}
      <AnimatePresence mode="wait">
        {selectedDate && selectedDayData && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-4 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {formatDate(selectedDate)} 任务详情
              </h3>
            </div>

            {selectedDayData.tasksBySubject.length === 0 ? (
              <p className="text-center text-gray-500 py-4">这天没有布置任务</p>
            ) : (
              <div className="space-y-4">
                {selectedDayData.tasksBySubject.map(({ subject, tasks, completed }) => (
                  <div 
                    key={subject.id}
                    className="rounded-xl overflow-hidden"
                    style={{ borderLeft: `4px solid ${subject.color}` }}
                  >
                    <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: subject.color }}
                        >
                          <BookOpen size={14} />
                        </div>
                        <span className="font-semibold text-gray-700">{subject.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {completed}/{tasks.length} 完成
                      </span>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`flex items-center gap-2 ${task.completed ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {task.completed ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <Circle size={16} className="text-gray-300" />
                          )}
                          <span className={task.completed ? 'line-through' : ''}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </PageTransition>
  );
}
