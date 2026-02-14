import { useState } from 'react';
import { Heart, Filter, Mic, MicOff, BarChart3, ChevronDown } from 'lucide-react';
import type { DiscoverCard, TimeFilter } from '../types';
import { SwipeCard } from './SwipeCard';
import { FavoritesList } from './FavoritesList';
import { CardDetail } from './CardDetail';

interface DiscoverPageProps {
  cards: DiscoverCard[];
  allCards: DiscoverCard[];
  favorites: string[];
  subPage: 'swipe' | 'favorites' | 'detail';
  selectedCardId: string | null;
  activeFilter: TimeFilter;
  onSwipe: (cardId: string, direction: 'right' | 'left') => void;
  onNavigateToDetail: (cardId: string) => void;
  onNavigateToFavorites: () => void;
  onNavigateToSwipe: () => void;
  onRemoveFavorite: (cardId: string) => void;
  onFilterChange: (filter: TimeFilter) => void;
  preferenceStats: {
    totalSwiped: number;
    likedCount: number;
    dislikedCount: number;
    categoryCounts: Record<string, number>;
  };
}

const filterOptions: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'this-weekend', label: '今週末' },
  { value: 'next-month', label: '来月' },
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
];

const categoryLabels: Record<string, string> = {
  drive: 'ドライブ',
  gourmet: 'グルメ',
  nature: '自然',
  event: 'イベント',
  family: 'ファミリー',
  movie: '映画',
  magazine: 'メディア',
};

export function DiscoverPage({
  cards,
  allCards,
  favorites,
  subPage,
  selectedCardId,
  activeFilter,
  onSwipe,
  onNavigateToDetail,
  onNavigateToFavorites,
  onNavigateToSwipe,
  onRemoveFavorite,
  onFilterChange,
  preferenceStats,
}: DiscoverPageProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('お使いのブラウザは音声入力に対応していません。');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setVoiceText(text);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  // Detail subpage
  if (subPage === 'detail' && selectedCardId) {
    const card = allCards.find((c) => c.id === selectedCardId);
    if (!card) return null;
    return (
      <CardDetail
        card={card}
        isFavorite={favorites.includes(card.id)}
        onBack={onNavigateToSwipe}
        onToggleFavorite={() => {
          if (favorites.includes(card.id)) {
            onRemoveFavorite(card.id);
          } else {
            onSwipe(card.id, 'right');
          }
        }}
      />
    );
  }

  // Favorites subpage
  if (subPage === 'favorites') {
    const favoriteCards = allCards.filter((c) => favorites.includes(c.id));
    return (
      <FavoritesList
        cards={favoriteCards}
        onBack={onNavigateToSwipe}
        onCardClick={onNavigateToDetail}
        onRemoveFavorite={onRemoveFavorite}
      />
    );
  }

  // Main swipe view
  const currentCard = cards[0];

  return (
    <div className="pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-warm-800">Discover</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-full transition-colors ${
              showStats ? 'bg-warm-200 text-warm-700' : 'bg-warm-100 text-warm-400'
            }`}
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={onNavigateToFavorites}
            className="relative p-2 rounded-full bg-warm-100 text-warm-400 hover:bg-warm-200 transition-colors"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats panel */}
      {showStats && preferenceStats.totalSwiped > 0 && (
        <div className="animate-slide-up bg-warm-50 rounded-xl p-4 mb-4 border border-warm-100">
          <h3 className="text-xs font-bold text-warm-700 mb-2">あなたの好み分析</h3>
          <div className="flex gap-4 mb-3">
            <div className="text-center">
              <p className="text-lg font-bold text-leaf-600">{preferenceStats.likedCount}</p>
              <p className="text-[10px] text-warm-400">気になる</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-rose-500">{preferenceStats.dislikedCount}</p>
              <p className="text-[10px] text-warm-400">スキップ</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-warm-600">{preferenceStats.totalSwiped}</p>
              <p className="text-[10px] text-warm-400">合計</p>
            </div>
          </div>
          {Object.keys(preferenceStats.categoryCounts).length > 0 && (
            <div>
              <p className="text-[10px] text-warm-400 mb-1.5">お気に入りカテゴリ</p>
              <div className="flex gap-1.5 flex-wrap">
                {Object.entries(preferenceStats.categoryCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => (
                    <span
                      key={cat}
                      className="bg-warm-200 text-warm-700 text-[10px] px-2 py-0.5 rounded-full"
                    >
                      {categoryLabels[cat] || cat} ({count})
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-1.5 text-xs text-warm-500 bg-warm-100 px-3 py-1.5 rounded-full hover:bg-warm-200 transition-colors"
        >
          <Filter size={14} />
          {filterOptions.find((f) => f.value === activeFilter)?.label || 'すべて'}
          <ChevronDown size={12} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
        </button>
        {showFilter && (
          <div className="animate-fade-in flex flex-wrap gap-1.5 mt-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onFilterChange(opt.value);
                  setShowFilter(false);
                }}
                className={`text-[11px] px-3 py-1 rounded-full transition-colors ${
                  activeFilter === opt.value
                    ? 'bg-warm-600 text-white'
                    : 'bg-warm-100 text-warm-500 hover:bg-warm-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Input */}
      <div className="mb-4">
        <button
          onClick={handleVoiceInput}
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full transition-all ${
            isListening
              ? 'bg-rose-100 text-rose-600 border border-rose-200'
              : 'bg-warm-50 text-warm-400 border border-warm-100 hover:bg-warm-100'
          }`}
        >
          {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          {isListening ? '聴いています...' : '音声でリクエスト'}
        </button>
        {voiceText && (
          <div className="mt-2 bg-sky-50 border border-sky-100 rounded-lg p-2.5 text-xs text-sky-700">
            「{voiceText}」で検索中...
          </div>
        )}
      </div>

      {/* Swipe Area */}
      {currentCard ? (
        <SwipeCard
          key={currentCard.id}
          card={currentCard}
          onSwipe={(dir) => onSwipe(currentCard.id, dir)}
          onDetail={() => onNavigateToDetail(currentCard.id)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-warm-300">
          <Sparkles size={48} className="mb-4 opacity-50" />
          <p className="text-sm font-medium">すべての提案をチェックしました！</p>
          <p className="text-xs mt-1">新しい提案をお楽しみに</p>
          {favorites.length > 0 && (
            <button
              onClick={onNavigateToFavorites}
              className="mt-4 text-xs text-warm-500 bg-warm-100 px-4 py-2 rounded-full hover:bg-warm-200 transition-colors"
            >
              お気に入りを見る ({favorites.length}件)
            </button>
          )}
        </div>
      )}

      {/* Remaining count */}
      {cards.length > 1 && (
        <p className="text-center text-[10px] text-warm-300 mt-3">
          あと {cards.length - 1} 件の提案があります
        </p>
      )}
    </div>
  );
}

function Sparkles({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
