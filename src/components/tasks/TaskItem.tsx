import { useState } from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task, Subject } from '../../types';
import PomodoroTimer from './PomodoroTimer';

interface TaskItemProps {
  task: Task;
  subject?: Subject;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onUpdatePomodoro: (taskId: string, completed: boolean) => void;
}

export default function TaskItem({ 
  task, 
  subject, 
  onToggleComplete, 
  onDelete,
  onUpdatePomodoro 
}: TaskItemProps) {
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm('确定要删除这个任务吗？')) {
      setIsDeleting(true);
      setTimeout(() => onDelete(task.id), 200);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isDeleting ? 0 : 1, 
          y: isDeleting ? -20 : 0,
          scale: isDeleting ? 0.9 : 1
        }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          card flex items-center gap-3 p-4 mb-3
          ${task.completed ? 'bg-gray-50' : 'bg-white'}
          hover:shadow-lg transition-all duration-200
        `}
      >
        {/* 完成按钮 */}
        <button
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className={`
            flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }
          `}
        >
          {task.completed && <Check size={18} />}
        </button>

        {/* 任务内容 */}
        <div className="flex-1 min-w-0">
          <p className={`
            font-medium transition-all duration-200
            ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}
          `}>
            {task.title}
          </p>
          {subject && (
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <span className="text-xs text-gray-500">{subject.name}</span>
              {task.pomodoroMinutes > 0 && (
                <span className="text-xs text-orange-500 flex items-center gap-1">
                  <Clock size={12} />
                  {task.pomodoroMinutes}分钟
                  {task.pomodoroCompleted && ' ✓'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 番茄钟按钮 */}
        <button
          onClick={() => setShowPomodoro(true)}
          className={`
            p-2 rounded-lg transition-colors duration-200
            ${task.pomodoroMinutes > 0 
              ? 'text-orange-500 hover:bg-orange-50' 
              : 'text-gray-400 hover:bg-gray-100'
            }
          `}
          title="番茄钟"
        >
          <Clock size={20} />
        </button>

        {/* 删除按钮 */}
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="删除"
        >
          <Trash2 size={20} />
        </button>
      </motion.div>

      {/* 番茄钟弹窗 */}
      {showPomodoro && (
        <PomodoroTimer
          task={task}
          onClose={() => setShowPomodoro(false)}
          onComplete={() => onUpdatePomodoro(task.id, true)}
        />
      )}
    </>
  );
}
