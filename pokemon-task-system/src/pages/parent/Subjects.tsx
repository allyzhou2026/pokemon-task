import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Palette, X, Check, BookOpen, Calculator, Languages, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubjects } from '../../hooks/useSubjects';
import { SUBJECT_COLORS } from '../../lib/utils';
import PageTransition, { StaggerContainer, StaggerItem } from '../../components/ui/PageTransition';
import EmptyState from '../../components/ui/EmptyState';

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  '语文': <BookOpen size={20} />,
  '英语': <Languages size={20} />,
  '数学': <Calculator size={20} />,
  '其他': <MoreHorizontal size={20} />,
};

export default function ParentSubjects() {
  const { user } = useAuth();
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects(user?.uid);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(SUBJECT_COLORS[4]);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (newName.trim()) {
      await addSubject(newName.trim(), newColor);
      setNewName('');
      setNewColor(SUBJECT_COLORS[4]);
      setIsAdding(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (editName.trim()) {
      await updateSubject(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDelete = async (id: string, isDefault?: boolean) => {
    if (isDefault) {
      alert('默认主题不能删除');
      return;
    }
    if (confirm('确定要删除这个主题吗？')) {
      await deleteSubject(id);
    }
  };

  const startEdit = (subject: { id: string; name: string }) => {
    setEditingId(subject.id);
    setEditName(subject.name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="pokeball w-12 h-12 animate-shake" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-4">
      {/* 默认主题说明 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">默认主题</h3>
            <p className="text-sm text-blue-600 mt-1">
              系统已预设语文、英语、数学、其他四个主题。您可以添加更多自定义主题。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 添加按钮 */}
      {!isAdding && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsAdding(true)}
          className="w-full bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          添加自定义主题
        </motion.button>
      )}

      {/* 添加表单 */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-4 shadow-md"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题名称
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如：科学、美术、音乐"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  选择颜色
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`
                        w-10 h-10 rounded-xl transition-all duration-200
                        ${newColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewName('');
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  添加
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主题列表 */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {subjects.length === 0 ? (
            <EmptyState
              icon="🎨"
              title="还没有主题"
              description="创建主题来分类管理任务"
              variant="card"
            />
          ) : (
            subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 card-interactive"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: subject.color }}
                >
                  {SUBJECT_ICONS[subject.name] || <BookOpen size={20} />}
                </div>

                {editingId === subject.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEdit(subject.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditName('');
                      }
                    }}
                  />
                ) : (
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{subject.name}</span>
                    {subject.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                        默认
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-1">
                  {editingId === subject.id ? (
                    <>
                      <button
                        onClick={() => handleEdit(subject.id)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditName('');
                        }}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      {!subject.isDefault && (
                        <>
                          <button
                            onClick={() => startEdit(subject)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id, subject.isDefault)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
