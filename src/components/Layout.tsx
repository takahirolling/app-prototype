import { Home, Compass, BookOpen } from 'lucide-react';
import type { TabType } from '../types';

interface LayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
  newBadge?: boolean;
}

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'memory', label: 'Memory', icon: BookOpen },
];

export function Layout({ activeTab, onTabChange, children, newBadge }: LayoutProps) {
  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-warm-50">
      {/* Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center py-2 px-4 relative transition-colors ${
                    isActive ? 'text-warm-600' : 'text-gray-400'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
                    {tab.id === 'discover' && newBadge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sunset-500 rounded-full" />
                    )}
                  </div>
                  <span className={`text-xs mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-warm-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
