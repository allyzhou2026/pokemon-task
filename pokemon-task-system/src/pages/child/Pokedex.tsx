import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Gift } from 'lucide-react';
import PokemonCard from '../../components/pokedex/PokemonCard';
import PokemonDetail from '../../components/pokedex/PokemonDetail';
import { useAuth } from '../../hooks/useAuth';
import { useCollections } from '../../hooks/useCollections';
import type { PokemonCollection } from '../../types';

export default function ChildPokedex() {
  const { user } = useAuth();
  const { collections, loading, getUniquePokemonCount } = useCollections(user?.uid);
  const [selectedCollection, setSelectedCollection] = useState<PokemonCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollections = collections.filter(collection =>
    collection.pokemonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const uniqueCollections = filteredCollections.filter((collection, index, self) =>
    index === self.findIndex(c => c.pokemonId === collection.pokemonId)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="pokeball w-12 h-12 animate-shake" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* 统计 */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
          <Gift size={16} />
          <span className="text-sm font-medium">已收集 {collections.length} 个</span>
        </div>
        <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          <Trophy size={16} />
          <span className="text-sm font-medium">{getUniquePokemonCount()} 种</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">图鉴完成度</span>
          <span className="text-sm font-bold text-pink-500">
            {getUniquePokemonCount()} / 151
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(getUniquePokemonCount() / 151) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索宝可梦..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
        />
      </div>

      {/* 宝可梦网格 */}
      {uniqueCollections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? '没有找到' : '图鉴还是空的'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? '试试其他关键词' : '去完成任务收集宝可梦！'}
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {uniqueCollections.map((collection, index) => (
              <PokemonCard
                key={collection.id}
                collection={collection}
                index={index}
                onClick={() => setSelectedCollection(collection)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
