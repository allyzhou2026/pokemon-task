import { useState, useEffect, useCallback } from 'react';
import { mockStorage } from '../lib/firebase';
import type { PokemonCollection } from '../types';

export function useCollections(userId: string | undefined) {
  const [collections, setCollections] = useState<PokemonCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCollections([]);
      setLoading(false);
      return;
    }

    // 从本地存储加载
    const data = mockStorage.getData(`collections_${userId}`);
    setCollections(data.map((c: any) => ({
      ...c,
      collectedAt: new Date(c.collectedAt),
    })).sort((a: any, b: any) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()));
    setLoading(false);
  }, [userId]);

  // 添加收集（每个主题独立收集）
  const addCollection = useCallback(async (pokemonData: {
    pokemonId: number;
    pokemonName: string;
    pokemonImage: string;
    types: string[];
    date: string;
    subjectId: string;
    subjectName: string;
  }) => {
    if (!userId) return;

    try {
      // 检查该主题当天是否已经收集过
      const existingCollection = collections.find(
        c => c.date === pokemonData.date && c.subjectId === pokemonData.subjectId
      );
      if (existingCollection) {
        throw new Error('该主题今天已经收集过精灵球了！');
      }

      const newCollection: PokemonCollection = {
        id: 'collection-' + Date.now(),
        userId,
        ...pokemonData,
        collectedAt: new Date(),
      };
      const updated = [newCollection, ...collections];
      mockStorage.setData(`collections_${userId}`, updated);
      setCollections(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [userId, collections]);

  // 检查某个主题当天是否已收集
  const hasCollectedSubject = useCallback((date: string, subjectId: string): boolean => {
    return collections.some(c => c.date === date && c.subjectId === subjectId);
  }, [collections]);

  // 检查当天是否有任何收集
  const hasCollectedToday = useCallback((date: string): boolean => {
    return collections.some(c => c.date === date);
  }, [collections]);

  // 获取当天所有收集
  const getCollectionsByDate = useCallback((date: string): PokemonCollection[] => {
    return collections.filter(c => c.date === date);
  }, [collections]);

  // 获取当天收集数量
  const getCollectionCountByDate = useCallback((date: string): number => {
    return collections.filter(c => c.date === date).length;
  }, [collections]);

  const getUniquePokemonCount = useCallback((): number => {
    const uniqueIds = new Set(collections.map(c => c.pokemonId));
    return uniqueIds.size;
  }, [collections]);

  return {
    collections,
    loading,
    error,
    addCollection,
    hasCollectedSubject,
    hasCollectedToday,
    getCollectionsByDate,
    getCollectionCountByDate,
    getUniquePokemonCount,
  };
}
