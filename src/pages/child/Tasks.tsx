import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  X,
  Maximize2,
  CheckCircle,
  Hourglass,
  Sparkles,
  Gift,
  Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubjects } from '../../hooks/useSubjects';
import { useTasks } from '../../hooks/useTasks';
import { useCollections } from '../../hooks/useCollections';
import PomodoroTimer from './PomodoroTimer';
import { getTodayString, formatDate, getTypeColor } from '../../lib/utils';
import EmptyState from '../../components/ui/EmptyState';
import PageTransition, { StaggerContainer, StaggerItem } from '../../components/ui/PageTransition';
import OpenAnimation from '../../components/collect/OpenAnimation';
import PokemonReveal from '../../components/collect/PokemonReveal';
import PokemonDetail from '../../components/pokedex/PokemonDetail';
import type { PokemonCollection } from '../../types';

export default function ChildTasks() {
  const { user } = useAuth();
  const { subjects } = useSubjects(user?.uid);
  const {
    tasks,
    submitTaskForApproval,
    getTasksByDate,
    checkAllTasksCompleted,
    checkAllTasksApproved,
    getRejectedTasks,
    getAwaitingReviewTasks,
    markTasksAwaitingReview
  } = useTasks(user?.uid);
  const { addCollection, hasCollectedSubject, getCollectionsByDate } = useCollections(user?.uid);

  const [currentDate, setCurrentDate] = useState(getTodayString());
  const [activeTimer, setActiveTimer] = useState<{ taskId: string; taskTitle: string; minutes: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 精灵球收集流程状态
  const [isOpening, setIsOpening] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [collectingSubject, setCollectingSubject] = useState<{ id: string; name: string } | null>(null);
  const [showPokemonDetail, setShowPokemonDetail] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<PokemonCollection | null>(null);

  const filteredTasks = getTasksByDate(currentDate);
  const completedTasks = filteredTasks.filter(t => t.completed);
  const approvedTasks = filteredTasks.filter(t => t.completed && t.approvalStatus === 'approved');
  const uncompletedTasks = filteredTasks.filter(t => !t.completed);
  const rejectedTasks = getRejectedTasks(currentDate);
  const allTasksCompleted = checkAllTasksCompleted(currentDate);

  // 当天已收集的记录
  const todayCollections = getCollectionsByDate(currentDate);

  // 计算每个主题的任务完成状态
  const subjectStatus = useMemo(() => {
    return subjects.map(subject => {
      const subjectTasks = filteredTasks.filter(t => t.subjectId === subject.id);
      const approvedSubjectTasks = subjectTasks.filter(t => t.approvalStatus === 'approved');
      const totalTasks = subjectTasks.length;
      const completedCount = approvedSubjectTasks.length;
      const allApproved = totalTasks > 0 && completedCount === totalTasks;
      const hasCollected = hasCollectedSubject(currentDate, subject.id);
      const canCollect = allApproved && !hasCollected;

      return {
        subject,
        totalTasks,
        completedCount,
        allApproved,
        hasCollected,
        canCollect,
      };
    });
  }, [subjects, filteredTasks, currentDate, hasCollectedSubject]);

  // 待完成任务（未审批和未完成的）
  const tasksBySubject = subjects.map(subject => ({
    subject,
    tasks: filteredTasks.filter(t => t.subjectId === subject.id && t.approvalStatus !== 'approved'),
  })).filter(group => group.tasks.length > 0);

  // 已审批通过的任务（按科目分组）
  const approvedTasksBySubject = subjects.map(subject => ({
    subject,
    tasks: filteredTasks.filter(t => t.subjectId === subject.id && t.approvalStatus === 'approved'),
  })).filter(group => group.tasks.length > 0);

  // 当所有任务完成时显示提示
  useState(() => {
    if (allTasksCompleted && uncompletedTasks.length === 0 && filteredTasks.length > 0) {
      markTasksAwaitingReview(currentDate);
      setShowCompletionModal(true);
    }
  });

  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleStartTask = (taskId: string, taskTitle: string) => {
    setActiveTimer({ taskId, taskTitle, minutes: 5 });
  };

  const handlePomodoroComplete = () => {
    // 倒计时完成，不自动标记完成，显示提交审批按钮
  };

  const handleSubmitForApproval = () => {
    if (activeTimer) {
      submitTaskForApproval(activeTimer.taskId);
      setActiveTimer(null);
    }
  };

  const handleCloseTimer = () => {
    setActiveTimer(null);
  };

  // 开始收集某个主题的精灵球
  const handleStartCollection = (subjectId: string, subjectName: string) => {
    setCollectingSubject({ id: subjectId, name: subjectName });
    setIsOpening(true);
  };

  const handleOpenAnimationComplete = () => {
    setIsOpening(false);
    setShowReveal(true);
  };

  const handleCollectionConfirm = async (pokemonData: {
    pokemonId: number;
    pokemonName: string;
    pokemonImage: string;
    types: string[];
  }) => {
    if (!collectingSubject) return;

    try {
      await addCollection({
        ...pokemonData,
        date: currentDate,
        subjectId: collectingSubject.id,
        subjectName: collectingSubject.name,
      });
      setShowReveal(false);
      setCollectingSubject(null);
    } catch (err) {
      console.error('Collection failed:', err);
    }
  };

  const handleCloseReveal = () => {
    setShowReveal(false);
    setCollectingSubject(null);
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
    setPlayingAudio(url);
    audio.onended = () => setPlayingAudio(null);
  };

  // 可收集的主题列表
  const collectableSubjects = subjectStatus.filter(s => s.canCollect);

  return (
    <PageTransition className="space-y-3 pb-4">
      {/* 日期导航 */}
      <div className="flex items-center justify-between bg-white rounded-xl p-2 shadow-sm">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-pink-400" />
        </button>
        
        <div className="text-center">
          <h2 className="text-base font-bold text-gray-800">
            {formatDate(currentDate)}
          </h2>
          <p className="text-xs text-pink-500">
            {completedTasks.length}/{filteredTasks.length} 已完成
          </p>
        </div>
        
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-pink-400" />
        </button>
      </div>

      {/* 等待检查提示 */}
      {allTasksCompleted && !checkAllTasksApproved(currentDate) && filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2"
        >
          <Hourglass size={18} className="text-blue-500" />
          <span className="text-sm text-blue-700">
            已完成所有任务！等待爸爸妈妈检查作业...
          </span>
        </motion.div>
      )}

      {/* 可收集的精灵球提示 - 每个主题独立 */}
      {collectableSubjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {collectableSubjects.map(({ subject }) => (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartCollection(subject.id, subject.name)}
              className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift size={20} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-orange-700">
                  🎉 {subject.name}任务检查通过！
                </p>
                <p className="text-sm text-orange-600">
                  点击领取精灵球！
                </p>
              </div>
              <Sparkles size={24} className="text-yellow-500" />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 今天已收集的宝可梦 */}
      {todayCollections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3"
        >
          <p className="text-sm font-bold text-purple-700 mb-2">
            今天已收集 {todayCollections.length} 只宝可梦
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {todayCollections.map((collection) => (
              <motion.div
                key={collection.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedCollection(collection);
                  setShowPokemonDetail(true);
                }}
                className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm cursor-pointer flex items-center justify-center"
              >
                <img
                  src={collection.pokemonImage}
                  alt={collection.pokemonName}
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 等待完成提示 */}
      {uncompletedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2"
        >
          <Hourglass size={18} className="text-yellow-500" />
          <span className="text-sm text-yellow-700">
            有 {uncompletedTasks.length} 个任务等待完成
          </span>
        </motion.div>
      )}

      {/* 被拒绝提示 */}
      {rejectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-3"
        >
          <p className="text-sm text-red-700">
            {rejectedTasks.length} 个任务需要重新完成，加油！
          </p>
        </motion.div>
      )}

      {/* 待完成任务 - 按科目分组 */}
      <StaggerContainer className="space-y-4" staggerDelay={0.08}>
        {tasksBySubject.length === 0 && approvedTasks.length === 0 ? (
          <EmptyState
            icon="🌟"
            title="今天没有任务"
            description="好好休息一下吧！明天继续加油！"
            variant="card"
          />
        ) : (
          <>
            {/* 待完成任务 */}
            {tasksBySubject.map(({ subject, tasks }) => (
              <StaggerItem key={subject.id} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <h3 className="text-sm font-bold text-gray-700">{subject.name}</h3>
                </div>

                <div className="space-y-2">
                  {tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        bg-white rounded-xl p-3 shadow-sm border transition-all
                        ${task.approvalStatus === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                          style={{ backgroundColor: `${subject.color}CC` }}
                        >
                          <span>{taskIndex + 1}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-800 flex-1">
                              {task.title}
                            </p>
                            {task.completed && (
                              <span className="text-xs text-green-600 font-medium whitespace-nowrap ml-2">已完成</span>
                            )}
                            {task.approvalStatus === 'rejected' && (
                              <span className="text-xs text-red-600 whitespace-nowrap ml-2">需要重做</span>
                            )}
                          </div>

                          {task.attachments && task.attachments.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {task.attachments.map((att, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (att.type === 'image') {
                                      setPreviewImage(att.url);
                                    } else {
                                      playAudio(att.url);
                                    }
                                  }}
                                  className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-pink-300 transition-all"
                                >
                                  {att.type === 'image' ? (
                                    <>
                                      <img src={att.url} alt="" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Maximize2 size={12} className="text-white" />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Volume2
                                        size={14}
                                        className={`${playingAudio === att.url ? 'text-pink-500 animate-pulse' : 'text-gray-500'}`}
                                      />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {task.approvalStatus === 'rejected' ? (
                          <button
                            onClick={() => handleStartTask(task.id, task.title)}
                            className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-red-400 to-red-500 text-white text-xs font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all flex items-center gap-1"
                          >
                            <Play size={12} fill="white" />
                            重做
                          </button>
                        ) : !task.completed ? (
                          <button
                            onClick={() => handleStartTask(task.id, task.title)}
                            className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all flex items-center gap-1"
                          >
                            <Play size={12} fill="white" />
                            开始
                          </button>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </StaggerItem>
            ))}

            {/* 已审批通过的任务 */}
            {approvedTasksBySubject.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-green-600 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} />
                  已检查
                </h3>
                {approvedTasksBySubject.map(({ subject, tasks }) => (
                  <StaggerItem key={subject.id} className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 px-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <h3 className="text-sm font-bold text-gray-700">{subject.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-green-50 rounded-xl p-3 border border-green-100 opacity-70"
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                              style={{ backgroundColor: `${subject.color}CC` }}
                            >
                              <span>{taskIndex + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 line-through">{task.title}</p>
                                <span className="text-xs text-green-600 font-medium whitespace-nowrap ml-2">已检查</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </StaggerItem>
                ))}
              </div>
            )}
          </>
        )}
      </StaggerContainer>

      {/* 图片预览弹窗 */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-full"
              >
                <X size={24} />
              </button>
              <img
                src={previewImage}
                alt="预览"
                className="max-w-full max-h-[80vh] rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 番茄钟计时弹窗 */}
      <AnimatePresence>
        {activeTimer && (
          <PomodoroTimer
            taskTitle={activeTimer.taskTitle}
            initialMinutes={activeTimer.minutes}
            onComplete={handlePomodoroComplete}
            onTaskComplete={handleSubmitForApproval}
            onClose={handleCloseTimer}
          />
        )}
      </AnimatePresence>

      {/* 完成所有任务提示弹窗 */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                恭喜完成今天所有任务！
              </h2>
              <p className="text-gray-600 mb-6">
                太棒了！请等待爸爸妈妈检查完作业，就可以抽取精灵球啦！
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl shadow-lg"
              >
                好的，我知道了！
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 精灵球打开动画 */}
      <AnimatePresence>
        {isOpening && (
          <OpenAnimation onComplete={handleOpenAnimationComplete} />
        )}
      </AnimatePresence>

      {/* 宝可梦揭示弹窗 */}
      <AnimatePresence>
        {showReveal && (
          <PokemonReveal
            onClose={handleCloseReveal}
            onConfirm={handleCollectionConfirm}
            date={currentDate}
          />
        )}
      </AnimatePresence>

      {/* 宝可梦详情弹窗 */}
      <AnimatePresence>
        {showPokemonDetail && selectedCollection && (
          <PokemonDetail
            collection={selectedCollection}
            onClose={() => {
              setShowPokemonDetail(false);
              setSelectedCollection(null);
            }}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
