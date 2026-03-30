import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Sparkles,
  Mic,
  Image as ImageIcon,
  X,
  Trash2,
  Check,
  Wand2,
  Edit2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Volume2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubjects } from '../../hooks/useSubjects';
import { useTasks } from '../../hooks/useTasks';
import type { Task, TaskAttachment } from '../../types';
import { getTodayString, formatDate, splitTasks } from '../../lib/utils';
import PageTransition, { StaggerContainer, StaggerItem } from '../../components/ui/PageTransition';
import EmptyState from '../../components/ui/EmptyState';

export default function ParentTasks() {
  const { user } = useAuth();
  const { subjects } = useSubjects(user?.uid);
  const { tasks, addTask, addTasksBatch, deleteTask, toggleTaskComplete, updateTask, getTasksByDate, approveTask, getPendingApprovalTasks, getAwaitingReviewTasks, completeParentReview, checkAllTasksCompleted } = useTasks(user?.uid);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editAttachments, setEditAttachments] = useState<TaskAttachment[]>([]);
  const [currentDate, setCurrentDate] = useState(getTodayString);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string>('');
  
  // 添加任务表单
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAttachments, setNewTaskAttachments] = useState<TaskAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  // 智能识别
  const [showSmartInput, setShowSmartInput] = useState(false);
  const [smartText, setSmartText] = useState('');
  const [smartSubjectId, setSmartSubjectId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const todayTasks = getTasksByDate(currentDate);
  const pendingApprovalTasks = getPendingApprovalTasks(currentDate);
  
  // 按主题分组任务
  const tasksBySubject = subjects.map(subject => ({
    subject,
    tasks: todayTasks.filter(t => t.subjectId === subject.id)
  }));

  // 语音输入 - 添加任务
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音输入');
      return;
    }

    setIsRecording(true);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNewTaskTitle(prev => prev ? prev + ' ' + transcript : transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      alert('语音识别失败');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // 语音输入 - 编辑任务
  const handleEditVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音输入');
      return;
    }

    setIsRecording(true);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (editingTask) {
        setEditingTask({ ...editingTask, title: editingTask.title + ' ' + transcript });
      }
      setIsRecording(false);
    };

    recognition.onerror = () => {
      alert('语音识别失败');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // 处理图片上传 - 添加任务
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment: TaskAttachment = {
          type: 'image',
          url: reader.result as string,
          name: file.name,
        };
        setNewTaskAttachments([...newTaskAttachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理图片上传 - 编辑任务
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment: TaskAttachment = {
          type: 'image',
          url: reader.result as string,
          name: file.name,
        };
        setEditAttachments([...editAttachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 删除附件 - 添加任务
  const removeAttachment = (index: number) => {
    setNewTaskAttachments(newTaskAttachments.filter((_, i) => i !== index));
  };

  // 删除附件 - 编辑任务
  const removeEditAttachment = (index: number) => {
    setEditAttachments(editAttachments.filter((_, i) => i !== index));
  };

  // 提交单个任务
  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeSubjectId) return;

    addTask({
      userId: user!.uid,
      subjectId: activeSubjectId,
      title: newTaskTitle.trim(),
      completed: false,
      date: currentDate,
      pomodoroMinutes: 0,
      pomodoroCompleted: false,
      attachments: newTaskAttachments.length > 0 ? newTaskAttachments : undefined,
    });

    // 重置表单
    setNewTaskTitle('');
    setNewTaskAttachments([]);
    setShowAddModal(false);
    setActiveSubjectId('');
  };

  // 智能识别添加
  const handleSmartAdd = () => {
    if (!smartText.trim() || !smartSubjectId) return;

    const titles = splitTasks(smartText);
    if (titles.length > 0) {
      addTasksBatch(titles, smartSubjectId, currentDate);
      setSmartText('');
      setShowSmartInput(false);
    }
  };

  // 打开添加任务弹窗
  const openAddModal = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setNewTaskTitle('');
    setNewTaskAttachments([]);
    setShowAddModal(true);
  };

  // 打开编辑弹窗
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditAttachments(task.attachments || []);
    setShowEditModal(true);
  };

  // 保存编辑
  const handleEditSave = () => {
    if (editingTask && editingTask.title.trim()) {
      updateTask(editingTask.id, { 
        title: editingTask.title.trim(),
        subjectId: editingTask.subjectId,
        attachments: editAttachments.length > 0 ? editAttachments : undefined
      });
      setShowEditModal(false);
      setEditingTask(null);
      setEditAttachments([]);
    }
  };

  // 切换主题展开
  const toggleSubjectExpand = (subjectId: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  return (
    <PageTransition className="space-y-4">
      {/* 日期导航 */}
      <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-4">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <span className="text-blue-600">←</span>
        </button>
        <div className="text-center">
          <p className="text-blue-600 font-semibold">{formatDate(currentDate)}</p>
          <p className="text-sm text-blue-500">{todayTasks.length} 个任务</p>
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <span className="text-blue-600">→</span>
        </button>
      </div>

      {/* 智能识别按钮 */}
      <button
        onClick={() => setShowSmartInput(true)}
        className="w-full bg-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
      >
        <Wand2 size={24} />
        智能识别添加任务
      </button>

      {/* 等待审批的任务 */}
      {pendingApprovalTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-yellow-600" />
            <h3 className="font-bold text-yellow-800">
              等待审批 ({pendingApprovalTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {pendingApprovalTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {subjects.find(s => s.id === task.subjectId)?.name} · 已完成番茄钟
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveTask(task.id, true)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="通过"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => approveTask(task.id, false)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="拒绝"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 按主题分组的任务列表 */}
      <StaggerContainer className="space-y-4" staggerDelay={0.08}>
        {tasksBySubject.length === 0 ? (
          <EmptyState
            icon="📝"
            title="还没有主题"
            description="先去「主题管理」创建主题"
            variant="card"
          />
        ) : (
          tasksBySubject.map(({ subject, tasks }) => (
            <StaggerItem key={subject.id}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* 主题标题 + 添加按钮 */}
              <div 
                className="flex items-center justify-between p-4"
                style={{ borderLeft: `4px solid ${subject.color}` }}
              >
                <button
                  onClick={() => toggleSubjectExpand(subject.id)}
                  className="flex items-center gap-3 flex-1"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: subject.color }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{tasks.length} 个任务</p>
                  </div>
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronUp size={20} className="text-gray-400 ml-2" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 ml-2" />
                  )}
                </button>
                
                {/* 在该主题下添加任务按钮 */}
                <button
                  onClick={() => openAddModal(subject.id)}
                  className="ml-3 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="添加任务"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* 任务列表 */}
              <AnimatePresence>
                {expandedSubjects.includes(subject.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2">
                      {tasks.length === 0 ? (
                        <p className="text-center text-gray-400 py-4 text-sm">该主题下还没有任务</p>
                      ) : (
                        tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`flex items-start gap-3 p-3 rounded-xl ${
                              task.completed ? 'bg-gray-50 opacity-60' : 'bg-gray-50'
                            }`}
                          >
                            <button
                              onClick={() => toggleTaskComplete(task.id, !task.completed)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                task.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-gray-300'
                              }`}
                            >
                              {task.completed && <Check size={14} />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`${task.completed && task.approvalStatus === 'approved' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {task.title}
                                </p>
                                {task.completed && task.approvalStatus === 'pending' && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    待审批
                                  </span>
                                )}
                                {task.approvalStatus === 'approved' && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    已通过
                                  </span>
                                )}
                                {task.approvalStatus === 'rejected' && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                    已拒绝
                                  </span>
                                )}
                              </div>
                              {task.attachments && task.attachments.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {task.attachments.map((att, idx) => (
                                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                      {att.type === 'image' ? (
                                        <img src={att.url} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Volume2 size={16} className="text-gray-500" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditModal(task)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StaggerItem>
        ))
      )}
      </StaggerContainer>

      {/* 家长检查完成按钮 - 当所有任务已完成且等待检查时显示 */}
      {(() => {
        const awaitingReview = getAwaitingReviewTasks(currentDate);
        const allCompleted = checkAllTasksCompleted(currentDate);
        const todayTasks = getTasksByDate(currentDate);

        if (allCompleted && awaitingReview.length === todayTasks.length && todayTasks.length > 0) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-20 left-4 right-4 z-40"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  completeParentReview(currentDate);
                  // 显示提示
                  alert('检查完成！宝贝现在可以抽取精灵球了！');
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                检查完成，让宝贝抽取精灵球
              </motion.button>
            </motion.div>
          );
        }
        return null;
      })()}

      {/* 添加任务弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  添加{subjects.find(s => s.id === activeSubjectId)?.name}任务
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* 任务输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">任务内容</label>
                <div className="relative">
                  <textarea
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="输入任务内容..."
                    className="w-full px-4 py-3 pr-20 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none min-h-[100px] resize-none"
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="add-task-file"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={18} className="text-gray-600" />
                    </label>
                    <button
                      onClick={handleVoiceInput}
                      className={`p-2 rounded-lg transition-colors ${
                        isRecording
                          ? 'bg-red-100 text-red-600 animate-pulse'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 附件预览 */}
              {newTaskAttachments.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {newTaskAttachments.map((att, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden">
                      {att.type === 'image' ? (
                        <img src={att.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Volume2 size={20} className="text-gray-500" />
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                添加任务
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 编辑任务弹窗 */}
      <AnimatePresence>
        {showEditModal && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">编辑任务</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 选择科目 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">科目</label>
                  <select
                    value={editingTask.subjectId}
                    onChange={(e) => setEditingTask({ ...editingTask, subjectId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 任务内容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">任务内容</label>
                  <div className="relative">
                    <textarea
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full px-4 py-3 pr-20 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none min-h-[100px] resize-none"
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        ref={editFileInputRef}
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                      <label
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                        onClick={() => editFileInputRef.current?.click()}
                      >
                        <ImageIcon size={18} className="text-gray-600" />
                      </label>
                      <button
                        onClick={handleEditVoiceInput}
                        className={`p-2 rounded-lg transition-colors ${
                          isRecording
                            ? 'bg-red-100 text-red-600 animate-pulse'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Mic size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 附件预览 */}
                {editAttachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">附件</label>
                    <div className="flex gap-2 flex-wrap">
                      {editAttachments.map((att, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden">
                          {att.type === 'image' ? (
                            <img src={att.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Volume2 size={20} className="text-gray-500" />
                            </div>
                          )}
                          <button
                            onClick={() => removeEditAttachment(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 保存按钮 */}
                <button
                  onClick={handleEditSave}
                  disabled={!editingTask.title.trim()}
                  className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  保存修改
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 智能识别弹窗 */}
      <AnimatePresence>
        {showSmartInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowSmartInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="text-purple-500" />
                  <h3 className="text-xl font-bold text-gray-800">智能识别</h3>
                </div>
                <button onClick={() => setShowSmartInput(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-purple-50 rounded-xl p-3 mb-4 text-sm text-purple-700">
                <p>输入多行文字，每行会自动变成一个任务。支持从其他地方复制粘贴！</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">选择科目</label>
                <select
                  value={smartSubjectId}
                  onChange={(e) => setSmartSubjectId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">选择科目</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={smartText}
                onChange={(e) => setSmartText(e.target.value)}
                placeholder={`例如：
背诵古诗《静夜思》
完成数学练习册第5页
读英语课本15分钟
整理书包`}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none min-h-[200px] resize-none mb-4"
              />

              {smartText && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    将创建 {splitTasks(smartText).length} 个任务：
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                    {splitTasks(smartText).map((title, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="truncate">{title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleSmartAdd}
                disabled={!smartText.trim() || !smartSubjectId}
                className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                智能生成任务 ({splitTasks(smartText).length})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
