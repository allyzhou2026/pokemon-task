import { useState, useEffect, useCallback } from 'react';
import { mockStorage } from '../lib/firebase';
import type { Task, TaskApprovalStatus } from '../types';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    // 从本地存储加载
    const data = mockStorage.getData(`tasks_${userId}`);
    setTasks(data.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    })));
    setLoading(false);
  }, [userId]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!userId) return;
    
    try {
      const newTask: Task = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: new Date(),
      };
      const updated = [...tasks, newTask];
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  const addTasksBatch = useCallback(async (titles: string[], subjectId: string, date: string) => {
    if (!userId) return;
    
    try {
      const newTasks: Task[] = titles.map((title, index) => ({
        id: 'task-' + Date.now() + '-' + index,
        userId,
        subjectId,
        title,
        completed: false,
        approvalStatus: 'pending',
        date,
        pomodoroMinutes: 0,
        pomodoroCompleted: false,
        createdAt: new Date(),
      }));
      const updated = [...tasks, ...newTasks];
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updated = tasks.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      );
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const updated = tasks.filter(t => t.id !== taskId);
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  // 提交任务完成申请（宝贝端使用）
  const submitTaskForApproval = useCallback(async (taskId: string) => {
    try {
      const updated = tasks.map(t => 
        t.id === taskId ? { ...t, completed: true, approvalStatus: 'pending' as TaskApprovalStatus } : t
      );
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  // 审批任务（家长端使用）
  const approveTask = useCallback(async (taskId: string, approved: boolean) => {
    try {
      const updated = tasks.map(t => 
        t.id === taskId 
          ? { ...t, approvalStatus: (approved ? 'approved' : 'rejected') as TaskApprovalStatus } 
          : t
      );
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(task => task.date === date);
  }, [tasks]);

  const getTasksBySubject = useCallback((subjectId: string) => {
    return tasks.filter(task => task.subjectId === subjectId);
  }, [tasks]);

  // 检查是否所有任务都已完成（宝贝端完成所有任务）
  const checkAllTasksCompleted = useCallback((date: string): boolean => {
    const dateTasks = tasks.filter(task => task.date === date);
    if (dateTasks.length === 0) return false;
    return dateTasks.every(task => task.completed);
  }, [tasks]);

  // 检查是否所有任务都已通过审批（可用于其他逻辑）
  const checkAllTasksApproved = useCallback((date: string): boolean => {
    const dateTasks = tasks.filter(task => task.date === date);
    if (dateTasks.length === 0) return false;
    return dateTasks.every(task => task.completed && task.approvalStatus === 'approved');
  }, [tasks]);

  // 获取等待审批的任务
  const getPendingApprovalTasks = useCallback((date: string) => {
    return tasks.filter(task => task.date === date && task.completed && task.approvalStatus === 'pending');
  }, [tasks]);

  // 获取被拒绝的任务
  const getRejectedTasks = useCallback((date: string) => {
    return tasks.filter(task => task.date === date && task.approvalStatus === 'rejected');
  }, [tasks]);

  // 获取已完成但等待家长检查的任务（新状态：awaiting_review）
  const getAwaitingReviewTasks = useCallback((date: string) => {
    return tasks.filter(task => task.date === date && task.completed && task.approvalStatus === 'awaiting_review');
  }, [tasks]);

  // 标记所有任务等待家长检查（宝贝完成所有任务后调用）
  const markTasksAwaitingReview = useCallback(async (date: string) => {
    try {
      const updated = tasks.map(t =>
        t.date === date && t.completed && t.approvalStatus === 'pending'
          ? { ...t, approvalStatus: 'awaiting_review' as TaskApprovalStatus }
          : t
      );
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  // 家长完成检查（将 awaiting_review 改为 approved）
  const completeParentReview = useCallback(async (date: string) => {
    try {
      const updated = tasks.map(t =>
        t.date === date && t.approvalStatus === 'awaiting_review'
          ? { ...t, approvalStatus: 'approved' as TaskApprovalStatus }
          : t
      );
      mockStorage.setData(`tasks_${userId}`, updated);
      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, tasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    addTasksBatch,
    updateTask,
    deleteTask,
    submitTaskForApproval,
    approveTask,
    getTasksByDate,
    getTasksBySubject,
    checkAllTasksCompleted,
    checkAllTasksApproved,
    getPendingApprovalTasks,
    getRejectedTasks,
    getAwaitingReviewTasks,
    markTasksAwaitingReview,
    completeParentReview,
  };
}
