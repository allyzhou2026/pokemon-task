import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Subject } from '../../types';

interface AddTaskFormProps {
  subjects: Subject[];
  currentDate: string;
  onSubmit: (title: string, subjectId: string, pomodoroMinutes: number) => void;
  onClose: () => void;
}

const POMODORO_OPTIONS = [0, 5, 10, 15];

export default function AddTaskForm({ 
  subjects, 
  onSubmit, 
  onClose 
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), subjectId, pomodoroMinutes);
      setTitle('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">添加新任务</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 任务名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务名称..."
              className="input-field"
              autoFocus
            />
          </div>

          {/* 选择主题 */}
          {subjects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择主题
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSubjectId(subject.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${subjectId === subject.id
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : 'hover:bg-gray-100'
                      }
                    `}
                    style={{ 
                      backgroundColor: subjectId === subject.id ? subject.color : 'transparent',
                      color: subjectId === subject.id ? 'white' : 'inherit'
                    }}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subjectId === subject.id ? 'white' : subject.color }}
                    />
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 番茄钟时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              番茄钟时间
            </label>
            <div className="flex gap-2">
              {POMODORO_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setPomodoroMinutes(minutes)}
                  className={`
                    flex-1 py-2 px-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${pomodoroMinutes === minutes
                      ? 'bg-pokemon-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {minutes === 0 ? '无' : `${minutes}分钟`}
                </button>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
