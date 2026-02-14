import { useState, useMemo } from 'react';
import { Heart, BarChart3, Mic, MicOff } from 'lucide-react';
import type { SuggestionCard, SwipeRecord, SeasonFilter } from '../../types';
import { mockSuggestions } from '../../data/mockData';
import { SwipeCard } from './SwipeCard';
import { FilterBar } from './FilterBar';
import { FavoritesList } from './FavoritesList';
import { CardDetail } from './CardDetail';
import { PreferenceChart } from './PreferenceChart';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface DiscoverPageProps {
  swipeHistory: SwipeRecord[];
  onSwipe: (cardId: string, direction: 'right' | 'left') => void;
}

export function DiscoverPage({ swipeHistory, onSwipe }: DiscoverPageProps) {
  const [filter, setFilter] = useState<SeasonFilter>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SuggestionCard | null>(null);
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const swipedIds = new Set(swipeHistory.map(s => s.cardId));
  const favoriteIds = new Set(
    swipeHistory.filter(s => s.direction === 'right').map(s => s.cardId)
  );

  const filteredCards = useMemo(() => {
    let cards = mockSuggestions.filter(c => !swipedIds.has(c.id));

    if (filter !== 'all' && filter !== 'weekend' && filter !== 'nextmonth') {
      cards = cards.filter(c => c.season === filter || c.season === 'all');
    }

    if (transcript) {
      const keywords = transcript.toLowerCase();
      cards = cards.filter(c =>
        c.title.toLowerCase().includes(keywords) ||
        c.summary.toLowerCase().includes(keywords) ||
        c.tags.some(t => t.toLowerCase().includes(keywords))
      );
    }

    return cards;
  }, [filter, swipedIds, transcript]);

  const favoriteCards = mockSuggestions.filter(c => favoriteIds.has(c.id));

  const handleSwipe = (direction: 'right' | 'left') => {
    if (filteredCards.length > 0) {
      onSwipe(filteredCards[0].id, direction);
    }
  };

  const handleShare = (card: SuggestionCard) => {
    const text = `${card.title}\n${card.summary}\n\n#MOBILIFE でチェック`;
    const url = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  };

  if (showFavorites) {
    return (
      <FavoritesList
        favorites={favoriteCards}
        onBack={() => setShowFavorites(false)}
        onShare={handleShare}
      />
    );
  }

  if (selectedCard) {
    return (
      <CardDetail
        card={selectedCard}
        isFavorite={favoriteIds.has(selectedCard.id)}
        onClose={() => setSelectedCard(null)}
        onToggleFavorite={() => {
          onSwipe(selectedCard.id, favoriteIds.has(selectedCard.id) ? 'left' : 'right');
        }}
        onShare={() => handleShare(selectedCard)}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">お出かけ提案</h1>
          <p className="text-xs text-gray-500">スワイプして気になるスポットを発見</p>
        </div>
        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-full transition-colors ${
                isListening ? 'bg-sunset-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-full transition-colors ${
              showStats ? 'bg-warm-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className="relative p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <Heart className="w-5 h-5" />
            {favoriteIds.size > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sunset-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {favoriteIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Voice input indicator */}
      {isListening && (
        <div className="mb-3 bg-sunset-50 border border-sunset-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-sunset-500 rounded-full animate-pulse" />
          <p className="text-sm text-sunset-700">
            {transcript || '音声で検索ワードを話してください...'}
          </p>
          {transcript && (
            <button onClick={resetTranscript} className="ml-auto text-xs text-sunset-600 underline">
              クリア
            </button>
          )}
        </div>
      )}

      {/* Filter */}
      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      {/* Stats panel */}
      {showStats && (
        <div className="mt-3">
          <PreferenceChart swipeHistory={swipeHistory} suggestions={mockSuggestions} />
        </div>
      )}

      {/* Swipe area */}
      <div className="relative mt-4" style={{ height: '480px' }}>
        {filteredCards.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-warm-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">すべてのカードをチェックしました</p>
            <p className="text-sm text-gray-400">新しい提案をお楽しみに！</p>
            <button
              onClick={() => setShowFavorites(true)}
              className="mt-4 px-5 py-2 bg-sunset-500 text-white rounded-full text-sm font-medium"
            >
              お気に入りを見る
            </button>
          </div>
        ) : (
          <>
            {filteredCards.slice(0, 2).reverse().map((card, i, arr) => (
              <SwipeCard
                key={card.id}
                card={card}
                onSwipe={handleSwipe}
                isTop={i === arr.length - 1}
              />
            ))}
          </>
        )}
      </div>

      {/* Card counter */}
      {filteredCards.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-2">
          残り {filteredCards.length} 件
        </p>
      )}
    </div>
  );
}
