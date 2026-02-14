import { Home, Compass, BookImage, User } from 'lucide-react';
import type { TabId } from '../types';

interface TabBarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  unreadCount: number;
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'memory', label: 'Memory', icon: BookImage },
  { id: 'profile', label: 'プロフィール', icon: User },
];

export function TabBar({ currentTab, onTabChange, unreadCount }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-warm-100 z-50">
      <div className="flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                isActive ? 'text-warm-600' : 'text-warm-300'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.id === 'discover' && unreadCount > 0 && (
                  <span className="badge-pulse absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-medium' : 'font-light'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
