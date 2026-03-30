import { ReactNode } from 'react';
import type { UserRole } from '../../types';
import BottomNav from './BottomNav';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  role: UserRole;
  onSwitchRole: () => void;
}

export default function Layout({ children, role, onSwitchRole }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header role={role} onSwitchRole={onSwitchRole} />
      <main className="flex-1 pb-20 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <BottomNav role={role} />
    </div>
  );
}
