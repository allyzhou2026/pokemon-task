// 本地存储模式 - 数据存在浏览器本地
// 适合单设备使用，或后续接入云存储

export const isMockMode = true;

// 模拟用户数据存储
export const mockStorage = {
  getUser: () => {
    const user = localStorage.getItem('mock_user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem('mock_user', JSON.stringify(user));
  },
  clearUser: () => {
    localStorage.removeItem('mock_user');
  },
  getData: (key: string) => {
    const data = localStorage.getItem(`mock_${key}`);
    return data ? JSON.parse(data) : [];
  },
  setData: (key: string, data: any) => {
    localStorage.setItem(`mock_${key}`, JSON.stringify(data));
  },
};

// 导出空的 auth 和 db 对象（用于类型兼容）
export const auth = null as any;
export const db = null as any;
export default {} as any;
