import { useState } from 'react';
import { X, Sparkles, List } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Subject } from '../../types';
import { splitTasks } from '../../lib/utils';

interface BatchCreateModalProps {
  subjects: Subject[];
  onSubmit: (titles: string[], subjectId: string) => void;
  onClose: () => void;
}

export default function BatchCreateModal({ 
  subjects, 
  onSubmit, 
  onClose 
}: BatchCreateModalProps) {
  const [text, setText] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');

  const taskTitles = splitTasks(text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitles.length > 0) {
      onSubmit(taskTitles, subjectId);
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
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pokemon-yellow" size={24} />
            <h3 className="text-xl font-bold text-gray-800">批量创建任务</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 使用说明 */}
          <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <List size={18} className="mt-0.5 flex-shrink-0" />
              <p>输入多行文本，每行会自动变成一个任务。支持复制粘贴列表！</p>
            </div>
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

          {/* 任务文本输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务列表
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`例如：
完成作业
整理房间
读一本书
练习钢琴`}
              className="input-field min-h-[150px] resize-none"
              autoFocus
            />
          </div>

          {/* 预览 */}
          {taskTitles.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                将创建 {taskTitles.length} 个任务：
              </p>
              <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                {taskTitles.map((title, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pokemon-blue text-white text-xs flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="truncate">{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              disabled={taskTitles.length === 0}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              创建 {taskTitles.length > 0 && `(${taskTitles.length})`}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
