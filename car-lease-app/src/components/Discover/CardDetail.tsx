import { X, MapPin, Clock, Tag, Heart, Share2 } from 'lucide-react';
import type { SuggestionCard } from '../../types';
import { categoryLabels } from '../../data/mockData';

interface CardDetailProps {
  card: SuggestionCard;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export function CardDetail({ card, isFavorite, onClose, onToggleFavorite, onShare }: CardDetailProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white animate-slide-up overflow-y-auto">
      {/* Full image */}
      <div className="relative h-72">
        <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {card.sourceLabel && (
          <div className="absolute top-4 left-4">
            <span className="bg-warm-600/90 text-white text-xs px-2.5 py-1 rounded">
              {card.sourceLabel}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="text-xs text-warm-200 font-medium">{categoryLabels[card.category]}</span>
          <h1 className="text-2xl font-bold text-white mt-1">{card.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {card.distance && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {card.distance}
            </span>
          )}
          {card.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {card.duration}
            </span>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed mb-5">{card.summary}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {card.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-warm-100 text-warm-700 text-sm px-3 py-1 rounded-full">
              <Tag className="w-3.5 h-3.5" /> {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onToggleFavorite}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors
              ${isFavorite
                ? 'bg-sunset-500 text-white'
                : 'bg-sunset-100 text-sunset-700'
              }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'white' : 'none'} />
            {isFavorite ? 'お気に入り済み' : '気になる'}
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest-100 text-forest-700 font-medium"
          >
            <Share2 className="w-5 h-5" />
            共有
          </button>
        </div>
      </div>
    </div>
  );
}
