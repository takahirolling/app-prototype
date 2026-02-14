import { useState } from 'react';
import type { TabType, SwipeRecord, Trip } from './types';
import { mockTrips } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { HomePage } from './components/Home/HomePage';
import { DiscoverPage } from './components/Discover/DiscoverPage';
import { MemoryPage } from './components/Memory/MemoryPage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [swipeHistory, setSwipeHistory] = useLocalStorage<SwipeRecord[]>('mobi-swipe-history', []);
  const [trips, setTrips] = useLocalStorage<Trip[]>('mobi-trips', mockTrips);

  const favorites = swipeHistory.filter(s => s.direction === 'right');
  const newSuggestionsCount = 3;

  const handleSwipe = (cardId: string, direction: 'right' | 'left') => {
    setSwipeHistory(prev => {
      const filtered = prev.filter(s => s.cardId !== cardId);
      return [...filtered, { cardId, direction, timestamp: Date.now() }];
    });
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      newBadge={newSuggestionsCount > 0}
    >
      {activeTab === 'home' && (
        <HomePage
          onNavigate={setActiveTab}
          trips={trips}
          favorites={favorites}
          newSuggestionsCount={newSuggestionsCount}
        />
      )}
      {activeTab === 'discover' && (
        <DiscoverPage
          swipeHistory={swipeHistory}
          onSwipe={handleSwipe}
        />
      )}
      {activeTab === 'memory' && (
        <MemoryPage
          trips={trips}
          onUpdateTrips={setTrips}
        />
      )}
    </Layout>
  );
}

export default App;
