import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, CheckCircle } from 'lucide-react';
import Pokeball from '../components/collect/Pokeball';
import OpenAnimation from '../components/collect/OpenAnimation';
import PokemonReveal from '../components/collect/PokemonReveal';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useCollections } from '../hooks/useCollections';
import { getTodayString } from '../lib/utils';

export default function Collect() {
  const { user } = useAuth();
  const { checkAllTasksCompleted } = useTasks(user?.uid);
  const { addCollection, hasCollectedToday, getCollectionByDate } = useCollections(user?.uid);
  
  const [isOpening, setIsOpening] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const today = getTodayString();
  
  const allTasksCompleted = checkAllTasksCompleted(today);
  const collectedToday = hasCollectedToday(today);
  const todayCollection = getCollectionByDate(today);

  const handleClickPokeball = () => {
    if (!allTasksCompleted || collectedToday) return;
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
        date: today,
      });
      setShowReveal(false);
    } catch (err) {
      console.error('Failed to collect:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-8"
    >
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">收集精灵球</h1>
        <p className="text-gray-500">完成任务后领取你的奖励！</p>
      </div>

      {/* 状态卡片 */}
      <div className="w-full max-w-sm mb-8 space-y-4">
        {/* 任务完成状态 */}
        <div className={`
          rounded-2xl p-4 flex items-center gap-4
          ${allTasksCompleted ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}
        `}>
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${allTasksCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
          `}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {allTasksCompleted ? '任务全部完成！' : '还有未完成的任务'}
            </p>
            <p className="text-sm text-gray-500">
              {allTasksCompleted ? '可以领取精灵球了' : '去完成任务页面看看吧'}
            </p>
          </div>
        </div>

        {/* 收集状态 */}
        {collectedToday && todayCollection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200"
          >
            <div className="flex items-center gap-4">
              <img
                src={todayCollection.pokemonImage}
                alt={todayCollection.pokemonName}
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="text-sm text-yellow-600">今天已获得</p>
                <p className="font-bold text-gray-800">{todayCollection.pokemonName}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 精灵球 */}
      <div className="relative">
        {/* 光环效果 */}
        {allTasksCompleted && !collectedToday && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 30px rgba(255, 215, 0, 0.3)',
                '0 0 60px rgba(255, 215, 0, 0.6)',
                '0 0 30px rgba(255, 215, 0, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transform: 'scale(1.2)' }}
          />
        )}

        {/* 精灵球 */}
        <Pokeball
          onClick={handleClickPokeball}
          disabled={!allTasksCompleted || collectedToday}
          isCollected={collectedToday}
          animate={allTasksCompleted && !collectedToday}
        />

        {/* 提示文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 font-medium"
        >
          {collectedToday ? (
            <span className="text-green-600 flex items-center justify-center gap-2">
              <Gift size={18} />
              今天已经收集过了
            </span>
          ) : allTasksCompleted ? (
            <span className="text-pokemon-blue flex items-center justify-center gap-2">
              <Sparkles size={18} />
              点击领取精灵球！
            </span>
          ) : (
            <span className="text-gray-400">完成任务后开启</span>
          )}
        </motion.p>
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
    </motion.div>
  );
}
