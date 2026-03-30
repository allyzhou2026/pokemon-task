import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Layout from './components/layout/Layout';
import type { UserRole } from './types';

// 家长端页面
import ParentOverview from './pages/parent/Overview';
import ParentSubjects from './pages/parent/Subjects';
import ParentTasks from './pages/parent/Tasks';

// 宝贝端页面
import ChildTasks from './pages/child/Tasks';
import ChildCollect from './pages/child/Collect';
import ChildDashboard from './pages/child/Dashboard';

function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储读取角色选择
    const savedRole = localStorage.getItem('pokemon_task_role') as UserRole;
    const hasSeenWelcome = localStorage.getItem('pokemon_task_welcome');

    if (savedRole) {
      setRole(savedRole);
    }
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
    setLoading(false);
  }, []);

  const handleStart = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setShowWelcome(false);
    localStorage.setItem('pokemon_task_role', selectedRole!);
    localStorage.setItem('pokemon_task_welcome', 'true');
  };

  const handleSwitchRole = () => {
    setRole(null);
    setShowWelcome(true);
    localStorage.removeItem('pokemon_task_role');
    localStorage.removeItem('pokemon_task_welcome');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="pokeball w-16 h-16 mx-auto mb-4 animate-shake" />
          <p className="text-gray-600 font-semibold">加载中...</p>
        </div>
      </div>
    );
  }

  // 显示欢迎页面
  if (showWelcome || !role) {
    return <Welcome onStart={handleStart} />;
  }

  // 家长端路由
  if (role === 'parent') {
    return (
      <Layout role={role} onSwitchRole={handleSwitchRole}>
        <Routes>
          <Route path="/" element={<ParentOverview />} />
          <Route path="/tasks" element={<ParentTasks />} />
          <Route path="/subjects" element={<ParentSubjects />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }

  // 宝贝端路由
  return (
    <Layout role={role} onSwitchRole={handleSwitchRole}>
      <Routes>
        <Route path="/" element={<ChildTasks />} />
        <Route path="/collect" element={<ChildCollect />} />
        <Route path="/dashboard" element={<ChildDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
