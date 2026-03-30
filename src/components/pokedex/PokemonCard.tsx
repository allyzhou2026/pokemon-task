import { motion } from 'framer-motion';
import type { PokemonCollection } from '../../types';
import { getTypeColor, typeNames } from '../../lib/utils';

interface PokemonCardProps {
  collection: PokemonCollection;
  onClick: () => void;
  index: number;
}

export default function PokemonCard({ collection, onClick, index }: PokemonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div 
        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${getTypeColor(collection.types[0] || 'normal')}20 0%, white 100%)`,
        }}
      >
        {/* 编号 */}
        <div className="absolute top-2 right-2 text-xs font-bold text-gray-400">
          #{String(collection.pokemonId).padStart(3, '0')}
        </div>

        {/* 图片 */}
        <div className="relative w-24 h-24 mx-auto mb-2">
          <img
            src={collection.pokemonImage}
            alt={collection.pokemonName}
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
          />
        </div>

        {/* 名称 */}
        <h3 className="text-center font-bold text-gray-800 mb-2 truncate">
          {collection.pokemonName}
        </h3>

        {/* 类型 */}
        <div className="flex justify-center gap-1 flex-wrap">
          {collection.types.slice(0, 2).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ backgroundColor: getTypeColor(type) }}
            >
              {typeNames[type] || type}
            </span>
          ))}
        </div>

        {/* 收集日期 */}
        <p className="text-center text-xs text-gray-400 mt-2">
          {new Date(collection.collectedAt).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </motion.div>
  );
}
