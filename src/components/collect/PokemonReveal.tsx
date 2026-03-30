import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { usePokemon } from '../../hooks/usePokemon';
import type { Pokemon, PokemonSpecies } from '../../types';
import { getTypeColor, typeNames } from '../../lib/utils';

interface PokemonRevealProps {
  onClose: () => void;
  onConfirm: (pokemonData: {
    pokemonId: number;
    pokemonName: string;
    pokemonImage: string;
    types: string[];
  }) => void;
  date: string; // 添加日期参数，用于周五特殊精灵
}

export default function PokemonReveal({ onClose, onConfirm, date }: PokemonRevealProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchPokemonSpecies, fetchPokemonForDay, getPokemonDescription, getPokemonImage, getPokemonName } = usePokemon();

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      // 根据日期获取宝可梦（周五有特殊精灵）
      const pokemonData = await fetchPokemonForDay(date);
      if (pokemonData) {
        setPokemon(pokemonData);
        const speciesData = await fetchPokemonSpecies(pokemonData.id);
        setSpecies(speciesData);
      }
      setLoading(false);
    };
    loadPokemon();
  }, [fetchPokemonForDay, fetchPokemonSpecies, date]);

  const handleCollect = () => {
    if (pokemon) {
      onConfirm({
        pokemonId: pokemon.id,
        pokemonName: getPokemonName(pokemon.id, pokemon.name),
        pokemonImage: getPokemonImage(pokemon),
        types: pokemon.types.map(t => t.type.name),
      });
    }
  };

  // 判断是否是周五
  const isFriday = new Date(date).getDay() === 5;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white font-semibold">正在捕捉宝可梦...</p>
        </div>
      </motion.div>
    );
  }

  if (!pokemon) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      >
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-500 mb-4">获取宝可梦失败，请重试</p>
          <button onClick={onClose} className="btn-primary">关闭</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Sparkles className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">
              {isFriday ? '周五特别奖励！' : '恭喜获得！'}
            </h2>
            <Sparkles className="text-yellow-500" size={24} />
          </motion.div>
          <p className="text-gray-500">
            {isFriday ? '今天有机会获得稀有精灵！' : '你成功捕捉到了一只宝可梦！'}
          </p>
        </div>

        {/* 宝可梦图片 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, delay: 0.3 }}
          className="relative mb-6"
        >
          <div
            className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${getTypeColor(pokemon.types[0]?.type.name || 'normal')}40 0%, ${getTypeColor(pokemon.types[0]?.type.name || 'normal')}20 100%)`,
            }}
          >
            <img
              src={getPokemonImage(pokemon)}
              alt={pokemon.name}
              className="w-40 h-40 object-contain drop-shadow-lg"
            />
          </div>

          {/* 闪光效果 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)',
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* 宝可梦信息 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            #{String(pokemon.id).padStart(3, '0')} {getPokemonName(pokemon.id, pokemon.name)}
          </h3>

          {/* 类型标签 */}
          <div className="flex justify-center gap-2 mb-4">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className="px-4 py-1 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
              >
                {typeNames[type.type.name] || type.type.name}
              </span>
            ))}
          </div>

          {/* 描述 */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {getPokemonDescription(species, pokemon?.id)}
          </p>
        </motion.div>

        {/* 确认按钮 */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleCollect}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          收入图鉴
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
