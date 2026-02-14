import { useState, useEffect, useCallback } from 'react';
import type {
  TabId,
  DiscoverCard,
  SwipeRecord,
  TimeFilter,
} from './types';
import { mockVehicle, mockProfile, mockDiscoverCards } from './mockData';

const STORAGE_KEY = 'mycarlife_state';

interface PersistedState {
  favorites: string[];
  swipeHistory: SwipeRecord[];
  readCardIds: string[];
}

function loadPersistedState(): PersistedState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return { favorites: [], swipeHistory: [], readCardIds: [] };
}

function savePersistedState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useAppState() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [discoverSubPage, setDiscoverSubPage] = useState<'swipe' | 'favorites' | 'detail'>('swipe');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');

  const persisted = loadPersistedState();

  const [discoverCards, setDiscoverCards] = useState<DiscoverCard[]>(() => {
    const cards = [...mockDiscoverCards];
    persisted.readCardIds.forEach((id) => {
      const card = cards.find((c) => c.id === id);
      if (card) card.isRead = true;
    });
    return cards;
  });

  const [favorites, setFavorites] = useState<string[]>(persisted.favorites);
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>(persisted.swipeHistory);

  useEffect(() => {
    const readCardIds = discoverCards.filter((c) => c.isRead).map((c) => c.id);
    savePersistedState({ favorites, swipeHistory, readCardIds });
  }, [favorites, swipeHistory, discoverCards]);

  const unreadCount = discoverCards.filter((c) => !c.isRead).length;

  const swipedCardIds = new Set(swipeHistory.map((s) => s.cardId));

  const getFilteredCards = useCallback(() => {
    let cards = discoverCards.filter((c) => !swipedCardIds.has(c.id));

    if (activeFilter !== 'all') {
      cards = cards.filter((card) => {
        switch (activeFilter) {
          case 'this-weekend':
            return true; // In a real app, filter by date
          case 'next-month':
            return true;
          case 'spring':
            return card.season === 'spring' || card.season === 'all';
          case 'summer':
            return card.season === 'summer' || card.season === 'all';
          case 'autumn':
            return card.season === 'autumn' || card.season === 'all';
          case 'winter':
            return card.season === 'winter' || card.season === 'all';
          default:
            return true;
        }
      });
    }

    return cards;
  }, [discoverCards, swipedCardIds, activeFilter]);

  const handleSwipe = useCallback(
    (cardId: string, direction: 'right' | 'left') => {
      const record: SwipeRecord = {
        cardId,
        direction,
        timestamp: new Date().toISOString(),
      };
      setSwipeHistory((prev) => [...prev, record]);

      if (direction === 'right') {
        setFavorites((prev) => [...new Set([...prev, cardId])]);
      }

      setDiscoverCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isRead: true } : c))
      );
    },
    []
  );

  const markAsRead = useCallback((cardId: string) => {
    setDiscoverCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isRead: true } : c))
    );
  }, []);

  const removeFavorite = useCallback((cardId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== cardId));
  }, []);

  const navigateToDetail = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setDiscoverSubPage('detail');
    markAsRead(cardId);
  }, [markAsRead]);

  const navigateToFavorites = useCallback(() => {
    setDiscoverSubPage('favorites');
  }, []);

  const navigateToSwipe = useCallback(() => {
    setDiscoverSubPage('swipe');
    setSelectedCardId(null);
  }, []);

  const getPreferenceStats = useCallback(() => {
    const liked = swipeHistory.filter((s) => s.direction === 'right');
    const disliked = swipeHistory.filter((s) => s.direction === 'left');

    const categoryCounts: Record<string, number> = {};
    liked.forEach((s) => {
      const card = discoverCards.find((c) => c.id === s.cardId);
      if (card) {
        categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
      }
    });

    return {
      totalSwiped: swipeHistory.length,
      likedCount: liked.length,
      dislikedCount: disliked.length,
      categoryCounts,
    };
  }, [swipeHistory, discoverCards]);

  return {
    currentTab,
    setCurrentTab,
    vehicle: mockVehicle,
    profile: mockProfile,
    discoverCards,
    favorites,
    swipeHistory,
    unreadCount,
    discoverSubPage,
    selectedCardId,
    activeFilter,
    setActiveFilter,
    getFilteredCards,
    handleSwipe,
    markAsRead,
    removeFavorite,
    navigateToDetail,
    navigateToFavorites,
    navigateToSwipe,
    setDiscoverSubPage,
    getPreferenceStats,
  };
}
