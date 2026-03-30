import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { getTodayString } from '../lib/utils';

export default function Tasks() {
  const { user } = useAuth();
  const { subjects } = useSubjects(user?.uid);
  const { 
    tasks, 
    loading, 
    addTask, 
    addTasksBatch, 
    toggleTaskComplete, 
    deleteTask,
    updateTask 
  } = useTasks(user?.uid);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const handleAddTask = async (title: string, subjectId: string, pomodoroMinutes: number) => {
    await addTask({
      userId: user!.uid,
      subjectId,
      title,
      completed: false,
      date: getTodayString(),
      pomodoroMinutes,
      pomodoroCompleted: false,
    });
  };

  const handleAddBatch = async (titles: string[], subjectId: string) => {
    await addTasksBatch(titles, subjectId, getTodayString());
  };

  const handleUpdatePomodoro = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { pomodoroCompleted: completed });
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
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">今日任务</h1>
        <p className="text-gray-500">完成任务收集精灵球！</p>
      </div>

      {/* Subject 筛选 */}
      {subjects.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSubjectId(null)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${selectedSubjectId === null
                ? 'bg-pokemon-blue text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            全部
          </button>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 flex items-center gap-2
                ${selectedSubjectId === subject.id
                  ? 'ring-2 ring-offset-2'
                  : 'hover:bg-gray-100'
                }
              `}
              style={{
                backgroundColor: selectedSubjectId === subject.id ? subject.color : 'white',
                color: selectedSubjectId === subject.id ? 'white' : 'inherit',
                ringColor: subject.color,
              }}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: selectedSubjectId === subject.id ? 'white' : subject.color 
                }}
              />
              {subject.name}
            </button>
          ))}
        </div>
      )}

      {/* 任务列表 */}
      <TaskList
        tasks={tasks}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onToggleComplete={toggleTaskComplete}
        onDelete={deleteTask}
        onAddTask={handleAddTask}
        onAddBatch={handleAddBatch}
        onUpdatePomodoro={handleUpdatePomodoro}
      />

      {/* 没有 Subject 的提示 */}
      {subjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 rounded-2xl p-4 text-center"
        >
          <p className="text-yellow-700 mb-2">还没有创建主题</p>
          <p className="text-sm text-yellow-600">
            先去"主题"页面创建一个主题吧！
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
