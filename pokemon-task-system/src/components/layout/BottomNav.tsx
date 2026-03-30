import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Tag,
  Trophy,
  LayoutDashboard,
  Calendar
} from 'lucide-react';
import type { UserRole } from '../../types';

interface BottomNavProps {
  role: UserRole;
}

const parentNavItems = [
  { path: '/', label: '周总览', icon: LayoutDashboard },
  { path: '/tasks', label: '布置任务', icon: Calendar },
  { path: '/subjects', label: '主题管理', icon: Tag },
];

// 自定义精灵球图标组件 - 上半红下半白
const PokeballIcon = ({ size = 22, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    {/* 上半部分红色 */}
    <path d="M50 5 A45 45 0 0 1 50 50 L5 50 A45 45 0 0 1 50 5" fill="#FF0000" stroke="#000" strokeWidth="5"/>
    {/* 下半部分白色 */}
    <path d="M50 50 L95 50 A45 45 0 0 1 50 95 A45 45 0 0 1 5 50 L50 50" fill="#FFFFFF" stroke="#000" strokeWidth="5"/>
    {/* 中间黑线 */}
    <line x1="5" y1="50" x2="95" y2="50" stroke="#000" strokeWidth="5"/>
    {/* 中间按钮 */}
    <circle cx="50" cy="50" r="15" fill="#FFF" stroke="#000" strokeWidth="3"/>
    <circle cx="50" cy="50" r="8" fill="#FFF" stroke="#ccc" strokeWidth="1"/>
  </svg>
);

const childNavItems = [
  { path: '/', label: '我的任务', icon: ClipboardList },
  { path: '/collect', label: '收集精灵', icon: PokeballIcon },
  { path: '/dashboard', label: '成就', icon: Trophy },
];

export default function BottomNav({ role }: BottomNavProps) {
  const location = useLocation();
  const navItems = role === 'parent' ? parentNavItems : childNavItems;
  const activeColor = role === 'parent' ? 'text-blue-500' : 'text-pink-500';
  const bgColor = role === 'parent' ? 'bg-blue-500' : 'bg-pink-500';

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center h-16 pb-safe">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex-1 flex flex-col items-center justify-center h-full"
              >
                <motion.div
                  className="flex flex-col items-center justify-center space-y-1"
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`
                      relative p-2 rounded-xl transition-colors duration-200
                      ${isActive
                        ? `${activeColor} ${role === 'parent' ? 'bg-blue-50' : 'bg-pink-50'}`
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>

                  <motion.span
                    animate={{
                      scale: isActive ? 1 : 0.95,
                      fontWeight: isActive ? 600 : 500,
                    }}
                    className={`
                      text-xs transition-colors duration-200
                      ${isActive ? activeColor : 'text-gray-400'}
                    `}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>

                {/* 选中背景效果 */}
                {isActive && (
                  <motion.div
                    layoutId="activeBg"
                    className={`absolute inset-0 ${role === 'parent' ? 'bg-blue-500/5' : 'bg-pink-500/5'} -z-10`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
