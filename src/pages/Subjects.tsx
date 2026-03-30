import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Palette, X, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubjects } from '../hooks/useSubjects';
import { SUBJECT_COLORS } from '../lib/utils';

export default function Subjects() {
  const { user } = useAuth();
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects(user?.uid);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(SUBJECT_COLORS[0]);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (newName.trim()) {
      await addSubject(newName.trim(), newColor);
      setNewName('');
      setNewColor(SUBJECT_COLORS[0]);
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

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个主题吗？相关的任务也会被影响。')) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">主题管理</h1>
        <p className="text-gray-500">创建和管理任务主题</p>
      </div>

      {/* 添加按钮 */}
      {!isAdding && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsAdding(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          添加新主题
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
              {/* 名称输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题名称
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如：学习、运动、家务"
                  className="input-field"
                  autoFocus
                />
              </div>

              {/* 颜色选择 */}
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

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewName('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex-1 btn-primary disabled:opacity-50"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-500">还没有主题</p>
              <p className="text-sm text-gray-400">添加一个主题开始组织任务吧</p>
            </motion.div>
          ) : (
            subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4"
              >
                {/* 颜色指示器 */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: subject.color }}
                />

                {/* 名称 */}
                {editingId === subject.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 input-field py-2"
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
                  <span className="flex-1 font-semibold text-gray-800">
                    {subject.name}
                  </span>
                )}

                {/* 操作按钮 */}
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
                      <button
                        onClick={() => startEdit(subject)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 提示 */}
      {subjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700"
        >
          <p>💡 提示：主题用于分类你的任务，可以按主题筛选和查看任务。</p>
        </motion.div>
      )}
    </motion.div>
  );
}
