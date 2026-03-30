import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // 验证输入
    if (!email.trim() || !password.trim()) {
      setLocalError('请填写邮箱和密码');
      return;
    }

    if (isRegister && !displayName.trim()) {
      setLocalError('请填写你的名字');
      return;
    }

    if (password.length < 6) {
      setLocalError('密码至少需要6个字符');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        await register(email.trim(), password, displayName.trim());
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setLocalError(err.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLocalError(null);
    setIsLoading(true);

    try {
      // 尝试登录演示账户
      await login('demo@example.com', 'demo123');
    } catch {
      // 如果登录失败，尝试注册演示账户
      try {
        await register('demo@example.com', 'demo123', 'Daniel');
      } catch (err: any) {
        setLocalError(err.message || '快速登录失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="pokeball w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pokemon-red to-pokemon-blue bg-clip-text text-transparent">
            宝可梦任务
          </h1>
          <p className="text-gray-500 mt-2">
            {isRegister ? '创建新账户' : '欢迎回来'}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="你的名字"
                  className="input-field pl-12"
                  disabled={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱地址"
              className="input-field pl-12"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（至少6个字符）"
              className="input-field pl-12 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {localError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2"
              >
                <AlertCircle size={16} />
                {localError}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              isRegister ? '注册' : '登录'
            )}
          </button>
        </form>

        {/* 切换 */}
        <div className="text-center mt-6">
          <p className="text-gray-500">
            {isRegister ? '已有账户？' : '还没有账户？'}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setLocalError(null);
              }}
              className="ml-1 text-pokemon-blue font-semibold hover:underline"
              disabled={isLoading}
            >
              {isRegister ? '登录' : '注册'}
            </button>
          </p>
        </div>

        {/* 快速体验按钮 */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            快速体验（无需注册）
          </button>
        </div>

        {/* 提示 */}
        <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
          <p className="font-semibold mb-1">💡 提示</p>
          <p>首次访问点击「快速体验」即可立即开始，或注册自己的账户保存数据。</p>
        </div>
      </motion.div>
    </div>
  );
}
