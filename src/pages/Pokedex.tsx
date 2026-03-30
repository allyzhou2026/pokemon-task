import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import PokemonCard from '../components/pokedex/PokemonCard';
import PokemonDetail from '../components/pokedex/PokemonDetail';
import { useAuth } from '../hooks/useAuth';
import { useCollections } from '../hooks/useCollections';
import type { PokemonCollection } from '../types';

export default function Pokedex() {
  const { user } = useAuth();
  const { collections, loading, getUniquePokemonCount } = useCollections(user?.uid);
  const [selectedCollection, setSelectedCollection] = useState<PokemonCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤和排序
  const filteredCollections = collections.filter(collection =>
    collection.pokemonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 去重显示（每个宝可梦只显示一次）
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
      className="space-y-6"
    >
      {/* 标题和统计 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">宝可梦图鉴</h1>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Sparkles className="text-yellow-500" size={18} />
          <span>已收集 {getUniquePokemonCount()} / 151</span>
        </div>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索宝可梦或类型..."
          className="input-field pl-12"
        />
      </div>

      {/* 宝可梦网格 */}
      {uniqueCollections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? '没有找到匹配的宝可梦' : '图鉴还是空的'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? '试试其他关键词' 
              : '完成任务收集精灵球，解锁宝可梦！'}
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
