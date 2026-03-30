import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 获取今天的日期字符串 YYYY-MM-DD
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 格式化日期显示
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateString === getTodayString()) {
    return '今天';
  } else if (dateString === yesterday.toISOString().split('T')[0]) {
    return '昨天';
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
}

// 获取一周的日期
export function getWeekDates(date: Date = new Date()): string[] {
  const week: string[] = [];
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一开始
  
  const monday = new Date(current.setDate(diff));
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d.toISOString().split('T')[0]);
  }
  
  return week;
}

// 将文本分割成多个任务
export function splitTasks(text: string): string[] {
  return text
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// 生成随机宝可梦ID (初代 1-151)
export function getRandomPokemonId(): number {
  return Math.floor(Math.random() * 151) + 1;
}

// 宝可梦类型中文映射
export const typeNames: Record<string, string> = {
  normal: '一般',
  fire: '火',
  water: '水',
  electric: '电',
  grass: '草',
  ice: '冰',
  fighting: '格斗',
  poison: '毒',
  ground: '地面',
  flying: '飞行',
  psychic: '超能力',
  bug: '虫',
  rock: '岩石',
  ghost: '幽灵',
  dragon: '龙',
  dark: '恶',
  steel: '钢',
  fairy: '妖精',
};

// 获取宝可梦类型颜色
export function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#888888';
}

// Subject 颜色选项
export const SUBJECT_COLORS = [
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#96CEB4', // 绿色
  '#FFEAA7', // 黄色
  '#DDA0DD', // 紫色
  '#FFD93D', // 金色
  '#6C5CE7', // 深紫
  '#A8E6CF', // 薄荷
  '#FF8B94', // 粉红
];
