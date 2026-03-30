import { useState, useEffect } from 'react';
import type { User } from '../types';

// 默认用户，无需登录
const DEFAULT_USER: User = {
  uid: 'demo-user',
  email: 'demo@example.com',
  displayName: 'Daniel',
};

export function useAuth() {
  const [user] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 这些函数保留用于兼容性，但不实际执行任何操作
  const login = async () => DEFAULT_USER;
  const register = async () => DEFAULT_USER;
  const logout = async () => {};
  const updateProfile = async () => {};

  return {
    user,
    loading,
    error: null,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: true,
  };
}
