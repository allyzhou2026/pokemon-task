import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: string | ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'compact' | 'card';
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default'
}: EmptyStateProps) {
  const variants = {
    default: 'py-12',
    compact: 'py-6',
    card: 'py-8 bg-white rounded-2xl shadow-sm'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center ${variants[variant]}`}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-4"
      >
        {typeof icon === 'string' ? (
          <span className="text-5xl">{icon}</span>
        ) : (
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-bold text-gray-700 mb-2"
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-500 mb-4 max-w-xs mx-auto"
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

// 预设的空状态
export function EmptyTasks({ role = 'child' }: { role?: 'parent' | 'child' }) {
  return (
    <EmptyState
      icon="📝"
      title={role === 'parent' ? '还没有任务' : '今天没有任务'}
      description={role === 'parent'
        ? '点击上方按钮添加新任务'
        : '好好休息一下吧！'
      }
      variant="card"
    />
  );
}

export function EmptySubjects() {
  return (
    <EmptyState
      icon="📚"
      title="还没有主题"
      description="创建主题来分类管理任务"
      variant="card"
    />
  );
}

export function EmptyCollections() {
  return (
    <EmptyState
      icon="🎁"
      title="还没有收集到宝可梦"
      description="完成任务来获得精灵球吧！"
      variant="card"
    />
  );
}
