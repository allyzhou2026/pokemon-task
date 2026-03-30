import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import BatchCreateModal from './BatchCreateModal';
import type { Task, Subject } from '../../types';
import { getTodayString, formatDate } from '../../lib/utils';

interface TaskListProps {
  tasks: Task[];
  subjects: Subject[];
  selectedSubjectId: string | null;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (title: string, subjectId: string, pomodoroMinutes: number) => void;
  onAddBatch: (titles: string[], subjectId: string) => void;
  onUpdatePomodoro: (taskId: string, completed: boolean) => void;
}

export default function TaskList({
  tasks,
  subjects,
  selectedSubjectId,
  onToggleComplete,
  onDelete,
  onAddTask,
  onAddBatch,
  onUpdatePomodoro,
}: TaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(getTodayString());

  // 过滤当前日期的任务
  const filteredTasks = tasks.filter(task => {
    if (task.date !== currentDate) return false;
    if (selectedSubjectId && task.subjectId !== selectedSubjectId) return false;
    return true;
  });

  // 统计
  const completedCount = filteredTasks.filter(t => t.completed).length;
  const totalCount = filteredTasks.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // 切换日期
  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-4">
      {/* 日期导航 */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">
            {formatDate(currentDate)}
          </h2>
          <p className="text-sm text-gray-500">
            {completedCount}/{totalCount} 完成
          </p>
        </div>
        
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>

      {/* 完成提示 */}
      {allCompleted && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl p-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-700">
            <Sparkles size={20} />
            <span className="font-bold">太棒了！今天的任务全部完成！</span>
            <Sparkles size={20} />
          </div>
          <p className="text-sm text-yellow-600 mt-1">
            去收集页面领取你的精灵球吧！
          </p>
        </motion.div>
      )}

      {/* 添加按钮 */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          添加任务
        </button>
        <button
          onClick={() => setShowBatchModal(true)}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          批量创建
        </button>
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500">还没有任务</p>
              <p className="text-sm text-gray-400">点击上方按钮添加任务</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subject={subjects.find(s => s.id === task.subjectId)}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdatePomodoro={onUpdatePomodoro}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 添加任务表单 */}
      {showAddForm && (
        <AddTaskForm
          subjects={subjects}
          currentDate={currentDate}
          onSubmit={(title, subjectId, pomodoroMinutes) => {
            onAddTask(title, subjectId, pomodoroMinutes);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* 批量创建弹窗 */}
      {showBatchModal && (
        <BatchCreateModal
          subjects={subjects}
          onSubmit={(titles, subjectId) => {
            onAddBatch(titles, subjectId);
            setShowBatchModal(false);
          }}
          onClose={() => setShowBatchModal(false)}
        />
      )}
    </div>
  );
}
