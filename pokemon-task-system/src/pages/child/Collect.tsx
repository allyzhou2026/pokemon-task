import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, CheckCircle, Lock, Search, Trophy, Hourglass, ChevronLeft, ChevronRight } from 'lucide-react';
import Pokeball from '../../components/collect/Pokeball';
import OpenAnimation from '../../components/collect/OpenAnimation';
import PokemonReveal from '../../components/collect/PokemonReveal';
import PokemonCard from '../../components/pokedex/PokemonCard';
import PokemonDetail from '../../components/pokedex/PokemonDetail';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useCollections } from '../../hooks/useCollections';
import { getTodayString, formatDate } from '../../lib/utils';
import type { PokemonCollection } from '../../types';

export default function ChildCollect() {
  const location = useLocation();
  const { user } = useAuth();
  const { checkAllTasksCompleted, checkAllTasksApproved, getAwaitingReviewTasks, getTasksByDate } = useTasks(user?.uid);
  const { collections, addCollection, hasCollectedToday, getCollectionByDate, getUniquePokemonCount } = useCollections(user?.uid);

  const [isOpening, setIsOpening] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<PokemonCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(getTodayString());
  const today = getTodayString();

  // 自动打开精灵球（从任务页面跳转过来）
  useEffect(() => {
    const autoOpen = location.state?.autoOpen;
    const canOpen = checkAllTasksApproved(today) && !hasCollectedToday(today);

    if (autoOpen && canOpen && !isOpening && !showReveal) {
      const timer = setTimeout(() => {
        setIsOpening(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.state, checkAllTasksApproved, hasCollectedToday, today, isOpening, showReveal]);

  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const allTasksCompleted = checkAllTasksCompleted(currentDate);
  const allTasksApproved = checkAllTasksApproved(currentDate);
  const awaitingReview = getAwaitingReviewTasks(currentDate);
  const collectedOnDate = hasCollectedToday(currentDate);
  const dateCollection = getCollectionByDate(currentDate);
  const dateTasks = getTasksByDate(currentDate);

  // 只有当天且家长检查通过后才能抽精灵球
  const canOpenPokeball = currentDate === today && allTasksApproved && !collectedOnDate;

  const handleClickPokeball = () => {
    if (!canOpenPokeball) return;
    setIsOpening(true);
  };

  const handleAnimationComplete = () => {
    setIsOpening(false);
    setShowReveal(true);
  };

  const handleCollectPokemon = async (pokemonData: {
    pokemonId: number;
    pokemonName: string;
    pokemonImage: string;
    types: string[];
  }) => {
    try {
      await addCollection({
        ...pokemonData,
        date: currentDate,
      });
      setShowReveal(false);
    } catch (err) {
      console.error('Failed to collect:', err);
    }
  };

  // 获取指定日期收集的宝可梦
  const dateCollections = collections.filter(c => c.date === currentDate);

  // 去重显示
  const seenPokemonIds = new Set<number>();
  const uniqueDateCollections = dateCollections.filter((collection) => {
    if (seenPokemonIds.has(collection.pokemonId)) return false;
    seenPokemonIds.add(collection.pokemonId);
    return true;
  });

  // 所有收集的宝可梦（去重）
  const allSeenPokemonIds = new Set<number>();
  const allUniqueCollections = collections.filter((collection) => {
    if (allSeenPokemonIds.has(collection.pokemonId)) return false;
    allSeenPokemonIds.add(collection.pokemonId);
    return true;
  });

  // 过滤宝可梦
  const filteredCollections = allUniqueCollections.filter(collection =>
    collection.pokemonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isToday = currentDate === today;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-4"
    >
      {/* 我的宝可梦列表 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        {/* 进度条 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            <span className="font-bold text-gray-800">我的宝可梦</span>
            <span className="text-xs text-gray-500">
              ({getUniquePokemonCount()}种)
            </span>
          </div>
          <div className="text-xs text-pink-500 font-medium">
            已收集 {collections.length} 个
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(getUniquePokemonCount() / 151) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
          />
        </div>

        {/* 搜索 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索宝可梦..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-pink-400 focus:outline-none text-sm"
          />
        </div>

        {/* 宝可梦网格 - 2列布局 */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📖</div>
            <p className="text-gray-500 text-sm">还没有宝可梦</p>
            <p className="text-xs text-gray-400">完成任务收集吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedCollection(collection)}
                className="cursor-pointer"
              >
                <PokemonCard
                  collection={collection}
                  index={index}
                  onClick={() => setSelectedCollection(collection)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 开球动画 */}
      <AnimatePresence>
        {isOpening && (
          <OpenAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>

      {/* 宝可梦展示 */}
      <AnimatePresence>
        {showReveal && (
          <PokemonReveal
            onClose={() => setShowReveal(false)}
            onConfirm={handleCollectPokemon}
          />
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedCollection && (
          <PokemonDetail
            collection={selectedCollection}
            onClose={() => setSelectedCollection(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
