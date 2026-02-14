import { ArrowLeft, Heart, Clock, MapPin, Trash2 } from 'lucide-react';
import type { DiscoverCard } from '../types';

interface FavoritesListProps {
  cards: DiscoverCard[];
  onBack: () => void;
  onCardClick: (cardId: string) => void;
  onRemoveFavorite: (cardId: string) => void;
}

export function FavoritesList({ cards, onBack, onCardClick, onRemoveFavorite }: FavoritesListProps) {
  return (
    <div className="pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-warm-600" />
        </button>
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-rose-500" fill="currentColor" />
          <h1 className="text-lg font-bold text-warm-800">気になるリスト</h1>
        </div>
        <span className="text-xs text-warm-400 ml-auto">{cards.length}件</span>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-warm-300">
          <Heart size={48} className="mb-4 opacity-30" />
          <p className="text-sm">まだお気に入りがありません</p>
          <p className="text-xs mt-1">気になる提案を右スワイプしてね</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="animate-slide-up flex bg-white rounded-xl overflow-hidden border border-warm-100 shadow-sm"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button
                onClick={() => onCardClick(card.id)}
                className="flex flex-1 text-left"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-3 min-w-0">
                  <p className="text-xs text-warm-400 mb-0.5">{card.source}</p>
                  <p className="text-sm font-medium text-warm-800 truncate">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-warm-400 line-clamp-1 mt-0.5">
                    {card.summary}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-warm-300 text-[10px]">
                    {card.estimatedDriveTime && (
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} /> {card.estimatedDriveTime}
                      </span>
                    )}
                    {card.estimatedDistance && (
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {card.estimatedDistance}
                      </span>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => onRemoveFavorite(card.id)}
                className="px-3 flex items-center text-warm-200 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
