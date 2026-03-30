import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Ruler, Weight, Sword, Shield, Zap, Heart, Target } from 'lucide-react';
import { usePokemon } from '../../hooks/usePokemon';
import type { PokemonCollection } from '../../types';
import { getTypeColor } from '../../lib/utils';

interface PokemonDetailProps {
  collection: PokemonCollection;
  onClose: () => void;
}

// 属性名称映射
const statNames: Record<string, string> = {
  'hp': 'HP',
  'attack': '攻击',
  'defense': '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  'speed': '速度',
};

// 属性图标
const statIcons: Record<string, React.ReactNode> = {
  'hp': <Heart size={14} />,
  'attack': <Sword size={14} />,
  'defense': <Shield size={14} />,
  'special-attack': <Zap size={14} />,
  'special-defense': <Shield size={14} />,
  'speed': <Target size={14} />,
};

// 类型中文映射
const typeNames: Record<string, string> = {
  'normal': '一般',
  'fire': '火',
  'water': '水',
  'electric': '电',
  'grass': '草',
  'ice': '冰',
  'fighting': '格斗',
  'poison': '毒',
  'ground': '地面',
  'flying': '飞行',
  'psychic': '超能力',
  'bug': '虫',
  'rock': '岩石',
  'ghost': '幽灵',
  'dragon': '龙',
  'dark': '恶',
  'steel': '钢',
  'fairy': '妖精',
};

export default function PokemonDetail({ collection, onClose }: PokemonDetailProps) {
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { fetchPokemon, getPokemonDescription } = usePokemon();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const pokemon = await fetchPokemon(collection.pokemonId);
      if (pokemon) {
        setPokemonData(pokemon);
      }
      setLoading(false);
    };
    loadData();
  }, [collection.pokemonId, fetchPokemon]);

  // 简化描述，只取前50字
  const getShortDescription = (desc: string) => {
    if (!desc) return '暂无描述';
    const cleanDesc = desc.replace(/\n|\f/g, ' ').trim();
    return cleanDesc.length > 50 ? cleanDesc.substring(0, 50) + '...' : cleanDesc;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部背景 */}
        <div
          className="relative h-32 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${getTypeColor(collection.types[0] || 'normal')} 0%, ${getTypeColor(collection.types[1] || collection.types[0] || 'normal')} 100%)`,
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
          >
            <X size={18} className="text-white" />
          </button>

          {/* 编号 */}
          <div className="absolute top-3 left-3 text-white/30 text-5xl font-bold">
            #{String(collection.pokemonId).padStart(3, '0')}
          </div>

          {/* 图片 */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-28 h-28 bg-white rounded-2xl shadow-xl p-2 flex items-center justify-center">
              <img
                src={collection.pokemonImage}
                alt={collection.pokemonName}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </motion.div>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="pt-14 pb-4 px-4 flex-1 overflow-y-auto">
          {/* 名称和类型 */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-3"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {collection.pokemonName}
            </h2>
            <div className="flex justify-center gap-2">
              {collection.types.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {typeNames[type] || type}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 基本信息 - 身高体重 */}
          {pokemonData && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex gap-3 mb-3"
            >
              <div className="flex-1 bg-blue-50 rounded-xl p-2 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500">身高</p>
                  <p className="text-sm font-bold text-gray-800">{(pokemonData.height / 10).toFixed(1)} m</p>
                </div>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-2 flex items-center gap-2">
                <Weight className="w-4 h-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500">体重</p>
                  <p className="text-sm font-bold text-gray-800">{(pokemonData.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 能力值 - 紧凑布局 */}
          {pokemonData?.stats && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-xl p-3 mb-3"
            >
              <h3 className="font-bold text-gray-800 mb-2 text-sm text-center">能力值</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {pokemonData.stats.slice(0, 6).map((stat: any) => {
                  const statName = statNames[stat.stat.name] || stat.stat.name;
                  const icon = statIcons[stat.stat.name];
                  const percentage = Math.min((stat.base_stat / 150) * 100, 100);

                  return (
                    <div key={stat.stat.name} className="flex items-center gap-2">
                      <div className="text-gray-400 shrink-0">
                        {icon}
                      </div>
                      <span className="text-[10px] text-gray-600 w-8">{statName}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getTypeColor(collection.types[0] || 'normal') }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 w-6 text-right">
                        {stat.base_stat}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 收集信息 */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center"
          >
            {collection.subjectName && (
              <p className="text-xs text-purple-500 mb-1">
                📚 {collection.subjectName}
              </p>
            )}
            <p className="text-xs text-gray-400">
              收集于 {new Date(collection.collectedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
