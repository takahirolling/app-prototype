import { ArrowLeft, Heart, Clock, MapPin, Share2, ExternalLink } from 'lucide-react';
import type { DiscoverCard } from '../types';

interface CardDetailProps {
  card: DiscoverCard;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
}

const categoryLabels: Record<string, string> = {
  drive: 'ドライブ',
  gourmet: 'グルメ',
  nature: '自然',
  event: 'イベント',
  family: 'ファミリー',
  movie: '映画',
  magazine: 'メディア',
};

export function CardDetail({ card, isFavorite, onBack, onToggleFavorite }: CardDetailProps) {
  const handleLineShare = () => {
    const text = `${card.title}\n${card.summary}`;
    const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  return (
    <div className="pb-20">
      {/* Hero image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Top buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleLineShare}
              className="p-2 rounded-full bg-[#06C755] text-white hover:bg-[#05b04d] transition-colors shadow-lg"
              title="LINEで共有"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/30 text-white hover:bg-rose-500'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {categoryLabels[card.category] || card.category}
            </span>
            {card.isNew && (
              <span className="bg-sunset-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white drop-shadow-lg">{card.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-4">
        {/* Info badges */}
        <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-warm-100">
          {card.estimatedDriveTime && (
            <div className="flex items-center gap-1.5 text-warm-500 text-xs">
              <Clock size={14} className="text-warm-400" />
              {card.estimatedDriveTime}
            </div>
          )}
          {card.estimatedDistance && (
            <div className="flex items-center gap-1.5 text-warm-500 text-xs">
              <MapPin size={14} className="text-warm-400" />
              {card.estimatedDistance}
            </div>
          )}
          <div className="ml-auto text-[11px] text-warm-300">
            {card.source}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-warm-600 leading-relaxed mb-4">
          {card.summary}
        </p>

        {/* Details */}
        {card.details && (
          <div className="bg-warm-50 rounded-xl p-4 mb-4">
            {card.details.split('\n').map((line, i) => (
              <p key={i} className={`text-sm text-warm-700 leading-relaxed ${line.startsWith('【') ? 'font-bold mt-3 mb-1' : line.startsWith('・') ? 'ml-2 text-warm-500' : 'mb-2'}`}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="bg-warm-100 text-warm-500 text-xs px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Source credit */}
        {card.sourceCredit && (
          <div className="bg-warm-50 rounded-lg p-3 mb-4 text-xs text-warm-400">
            出典: {card.sourceCredit}
          </div>
        )}

        {/* Map link */}
        {card.mapUrl && (
          <button
            onClick={() => window.open(card.mapUrl, '_blank')}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-sky-600 transition-colors mb-4"
          >
            <MapPin size={16} />
            地図で見る
            <ExternalLink size={14} />
          </button>
        )}

        {/* LINE Share button */}
        <button
          onClick={handleLineShare}
          className="w-full flex items-center justify-center gap-2 bg-[#06C755] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#05b04d] transition-colors"
        >
          <Share2 size={16} />
          LINEで家族に共有する
        </button>
      </div>
    </div>
  );
}
