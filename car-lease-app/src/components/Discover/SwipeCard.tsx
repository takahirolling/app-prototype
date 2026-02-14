import { useState, useRef } from 'react';
import { Heart, X, MapPin, Clock, Tag } from 'lucide-react';
import type { SuggestionCard } from '../../types';
import { categoryLabels } from '../../data/mockData';

interface SwipeCardProps {
  card: SuggestionCard;
  onSwipe: (direction: 'right' | 'left') => void;
  isTop: boolean;
}

export function SwipeCard({ card, onSwipe, isTop }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState<'right' | 'left' | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setIsDragging(true);
    startRef.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - startRef.current.x;
    const dy = clientY - startRef.current.y;
    setDragX(dx);
    setDragY(dy * 0.3);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (dragX > threshold) {
      triggerSwipe('right');
    } else if (dragX < -threshold) {
      triggerSwipe('left');
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  const triggerSwipe = (direction: 'right' | 'left') => {
    setSwipeAnimation(direction);
    setTimeout(() => onSwipe(direction), 300);
  };

  const rotation = isDragging ? dragX * 0.05 : 0;
  const opacity = isDragging ? Math.max(0.5, 1 - Math.abs(dragX) / 300) : 1;
  const likeOpacity = Math.min(1, Math.max(0, dragX / 100));
  const nopeOpacity = Math.min(1, Math.max(0, -dragX / 100));

  return (
    <div
      ref={cardRef}
      className={`absolute inset-x-4 top-0 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing
        ${swipeAnimation === 'right' ? 'animate-swipe-right' : ''}
        ${swipeAnimation === 'left' ? 'animate-swipe-left' : ''}
        ${!isTop ? 'scale-[0.95] opacity-70' : ''}
      `}
      style={{
        transform: isTop && isDragging ? `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg)` : isTop ? 'none' : 'scale(0.95) translateY(8px)',
        opacity: isTop ? opacity : 0.7,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        zIndex: isTop ? 10 : 5,
        touchAction: 'none',
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (isDragging) handleEnd(); }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Image */}
      <div className="relative h-64">
        <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* LIKE / NOPE overlays */}
        {isTop && (
          <>
            <div
              className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-bold text-2xl px-4 py-1 rounded-lg -rotate-12"
              style={{ opacity: likeOpacity }}
            >
              LIKE
            </div>
            <div
              className="absolute top-6 right-6 border-4 border-red-500 text-red-500 font-bold text-2xl px-4 py-1 rounded-lg rotate-12"
              style={{ opacity: nopeOpacity }}
            >
              NOPE
            </div>
          </>
        )}

        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {categoryLabels[card.category] || card.category}
          </span>
        </div>

        {/* Source credit */}
        {card.sourceLabel && (
          <div className="absolute bottom-16 left-4">
            <span className="bg-warm-600/90 text-white text-xs px-2 py-1 rounded">
              {card.sourceLabel}
            </span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white drop-shadow-lg">{card.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{card.summary}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {card.distance && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {card.distance}
            </span>
          )}
          {card.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {card.duration}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {card.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-0.5 bg-warm-100 text-warm-700 text-xs px-2 py-0.5 rounded-full">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {isTop && !isDragging && (
        <div className="flex justify-center gap-6 pb-5">
          <button
            onClick={(e) => { e.stopPropagation(); triggerSwipe('left'); }}
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); triggerSwipe('right'); }}
            className="w-14 h-14 rounded-full bg-sunset-500 flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <Heart className="w-7 h-7 text-white" fill="white" />
          </button>
        </div>
      )}
    </div>
  );
}
