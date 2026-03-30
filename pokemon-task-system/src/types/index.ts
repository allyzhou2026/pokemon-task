// 用户类型
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// 用户角色类型
export type UserRole = 'parent' | 'child' | null;

// Subject（任务主题）类型
export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
  isDefault?: boolean;
  createdAt: Date;
}

// 任务附件类型
export interface TaskAttachment {
  type: 'image' | 'audio';
  url: string;
  name?: string;
}

// 任务审批状态
export type TaskApprovalStatus = 'pending' | 'approved' | 'rejected' | 'awaiting_review';

// 任务类型
export interface Task {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  completed: boolean;
  approvalStatus: TaskApprovalStatus;
  date: string; // YYYY-MM-DD
  pomodoroMinutes: number; // 0/1/5/10/15
  pomodoroCompleted: boolean;
  attachments?: TaskAttachment[];
  createdAt: Date;
}

// 收集的宝可梦类型
export interface PokemonCollection {
  id: string;
  userId: string;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  types: string[];
  date: string; // YYYY-MM-DD
  subjectId: string; // 关联的主题ID
  subjectName: string; // 主题名称
  collectedAt: Date;
}

// 宝可梦API返回类型
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats?: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height?: number;
  weight?: number;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

// 每日任务状态
export interface DayStatus {
  date: string;
  totalTasks: number;
  completedTasks: number;
  approvedTasks: number;
  hasCollected: boolean;
  parentReviewed: boolean; // 家长是否已检查
}

// 导航项
export interface NavItem {
  path: string;
  label: string;
  icon: string;
}
