import { ArrowLeft, Heart, MapPin, Clock, Share2 } from 'lucide-react';
import type { SuggestionCard } from '../../types';
import { categoryLabels } from '../../data/mockData';

interface FavoritesListProps {
  favorites: SuggestionCard[];
  onBack: () => void;
  onShare: (card: SuggestionCard) => void;
}

export function FavoritesList({ favorites, onBack, onShare }: FavoritesListProps) {
  return (
    <div className="pb-24 animate-fade-in">
      <div className="sticky top-0 bg-warm-50/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">気になるリスト</h2>
        <span className="text-xs text-gray-500 ml-auto">{favorites.length}件</span>
      </div>

      {favorites.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">まだお気に入りがありません</p>
          <p className="text-gray-400 text-xs mt-1">カードを右にスワイプしてお気に入りに追加しましょう</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {favorites.map(card => (
            <div key={card.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex">
              <img src={card.imageUrl} alt={card.title} className="w-28 h-28 object-cover flex-shrink-0" />
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-warm-600 font-medium">
                      {categoryLabels[card.category]}
                    </span>
                    <h3 className="font-bold text-sm text-gray-800 truncate">{card.title}</h3>
                  </div>
                  <button
                    onClick={() => onShare(card)}
                    className="p-1.5 text-gray-400 hover:text-forest-600 flex-shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {card.distance && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {card.distance}
                    </span>
                  )}
                  {card.duration && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {card.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
