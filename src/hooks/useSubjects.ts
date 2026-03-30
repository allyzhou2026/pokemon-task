import { useState, useEffect, useCallback } from 'react';
import type { Subject } from '../types';

const DEFAULT_SUBJECTS: Omit<Subject, 'id' | 'createdAt'>[] = [
  { userId: '', name: '语文', color: '#FF6B6B', isDefault: true },
  { userId: '', name: '英语', color: '#4ECDC4', isDefault: true },
  { userId: '', name: '数学', color: '#45B7D1', isDefault: true },
  { userId: '', name: '其他', color: '#96CEB4', isDefault: true },
];

// 模拟存储
const getStoredSubjects = (userId: string): Subject[] => {
  try {
    const data = localStorage.getItem(`subjects_${userId}`);
    if (data) {
      return JSON.parse(data).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
      }));
    }
  } catch (e) {
    console.error('Error reading subjects:', e);
  }
  return [];
};

const setStoredSubjects = (userId: string, subjects: Subject[]) => {
  try {
    localStorage.setItem(`subjects_${userId}`, JSON.stringify(subjects));
  } catch (e) {
    console.error('Error saving subjects:', e);
  }
};

export function useSubjects(userId: string | undefined) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!userId) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    // 从本地存储加载
    let data = getStoredSubjects(userId);
    
    // 如果没有数据，初始化默认主题
    if (data.length === 0 && !initialized) {
      const defaultSubjects: Subject[] = DEFAULT_SUBJECTS.map((s, index) => ({
        ...s,
        id: `default-subject-${index}`,
        userId,
        createdAt: new Date(),
      }));
      data = defaultSubjects;
      setStoredSubjects(userId, data);
      setInitialized(true);
    }
    
    setSubjects(data);
    setLoading(false);
  }, [userId, initialized]);

  const addSubject = useCallback(async (name: string, color: string) => {
    if (!userId) return;
    
    try {
      const newSubject: Subject = {
        id: 'subject-' + Date.now(),
        userId,
        name,
        color,
        isDefault: false,
        createdAt: new Date(),
      };
      const updated = [...subjects, newSubject];
      setStoredSubjects(userId, updated);
      setSubjects(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, subjects]);

  const updateSubject = useCallback(async (subjectId: string, updates: Partial<Subject>) => {
    if (!userId) return;
    
    try {
      const updated = subjects.map(s => 
        s.id === subjectId ? { ...s, ...updates } : s
      );
      setStoredSubjects(userId, updated);
      setSubjects(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, subjects]);

  const deleteSubject = useCallback(async (subjectId: string) => {
    if (!userId) return;
    
    try {
      const updated = subjects.filter(s => s.id !== subjectId);
      setStoredSubjects(userId, updated);
      setSubjects(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, subjects]);

  return {
    subjects,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
  };
}
