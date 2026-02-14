import { useState, useRef } from 'react';
import { Heart, X, Clock, MapPin, Info } from 'lucide-react';
import type { DiscoverCard } from '../types';

interface SwipeCardProps {
  card: DiscoverCard;
  onSwipe: (direction: 'right' | 'left') => void;
  onDetail: () => void;
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

const categoryColors: Record<string, string> = {
  drive: 'bg-sky-500',
  gourmet: 'bg-sunset-500',
  nature: 'bg-leaf-500',
  event: 'bg-rose-500',
  family: 'bg-warm-500',
  movie: 'bg-purple-500',
  magazine: 'bg-indigo-500',
};

export function SwipeCard({ card, onSwipe, onDetail }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeClass, setSwipeClass] = useState('');
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 80;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    setDragX(dx);
    setDragY(dy * 0.3);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX > SWIPE_THRESHOLD) {
      setSwipeClass('swipe-right');
      setTimeout(() => onSwipe('right'), 350);
    } else if (dragX < -SWIPE_THRESHOLD) {
      setSwipeClass('swipe-left');
      setTimeout(() => onSwipe('left'), 350);
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  const handleButtonSwipe = (direction: 'right' | 'left') => {
    setSwipeClass(direction === 'right' ? 'swipe-right' : 'swipe-left');
    setTimeout(() => onSwipe(direction), 350);
  };

  const rotation = dragX * 0.08;
  const opacity = 1 - Math.abs(dragX) / 400;
  const likeOpacity = Math.max(0, dragX / SWIPE_THRESHOLD);
  const nopeOpacity = Math.max(0, -dragX / SWIPE_THRESHOLD);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        ref={cardRef}
        className={`relative w-full max-w-[360px] rounded-2xl overflow-hidden shadow-lg bg-white cursor-grab active:cursor-grabbing ${swipeClass}`}
        style={
          swipeClass
            ? undefined
            : {
                transform: `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg)`,
                opacity,
                transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
              }
        }
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => isDragging && handleEnd()}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {/* Image */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Like/Nope overlays */}
          <div
            className="absolute top-6 left-6 border-4 border-leaf-400 text-leaf-400 text-2xl font-black px-4 py-1 rounded-lg -rotate-12"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </div>
          <div
            className="absolute top-6 right-6 border-4 border-rose-400 text-rose-400 text-2xl font-black px-4 py-1 rounded-lg rotate-12"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`${categoryColors[card.category] || 'bg-warm-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {categoryLabels[card.category] || card.category}
            </span>
            {card.isNew && (
              <span className="bg-sunset-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </div>

          {/* Source credit */}
          {card.sourceCredit && (
            <div className="absolute top-3 right-3 bg-black/50 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              {card.sourceCredit}
            </div>
          )}

          {/* Card content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
              {card.title}
            </h3>
            <p className="text-white/90 text-xs leading-relaxed line-clamp-2 drop-shadow">
              {card.summary}
            </p>
          </div>
        </div>

        {/* Card footer */}
        <div className="p-3">
          <div className="flex items-center gap-4 text-warm-400 text-[11px] mb-2">
            {card.estimatedDriveTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {card.estimatedDriveTime}
              </span>
            )}
            {card.estimatedDistance && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {card.estimatedDistance}
              </span>
            )}
            <span className="ml-auto text-warm-300">{card.source}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="bg-warm-100 text-warm-500 text-[10px] px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="w-14 h-14 rounded-full bg-white border-2 border-warm-200 flex items-center justify-center shadow-md hover:border-rose-300 hover:shadow-lg transition-all active:scale-90"
        >
          <X size={26} className="text-rose-400" />
        </button>
        <button
          onClick={onDetail}
          className="w-10 h-10 rounded-full bg-white border-2 border-warm-200 flex items-center justify-center shadow-sm hover:border-sky-300 transition-all active:scale-90"
        >
          <Info size={18} className="text-sky-400" />
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-full bg-white border-2 border-warm-200 flex items-center justify-center shadow-md hover:border-leaf-300 hover:shadow-lg transition-all active:scale-90"
        >
          <Heart size={26} className="text-leaf-400" />
        </button>
      </div>
    </div>
  );
}
