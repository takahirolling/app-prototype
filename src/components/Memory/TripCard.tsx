import { MapPin, Camera, Mic, ChevronRight, Car } from 'lucide-react';
import type { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

export function TripCard({ trip, onSelect }: TripCardProps) {
  const dateObj = new Date(trip.date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[dateObj.getDay()];

  return (
    <button
      onClick={() => onSelect(trip)}
      className="w-full bg-white rounded-xl shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex">
        {/* Date column */}
        <div className="flex-shrink-0 w-16 bg-gradient-to-b from-warm-500 to-warm-600 flex flex-col items-center justify-center text-white py-3">
          <span className="text-xs">{month}月</span>
          <span className="text-2xl font-bold">{day}</span>
          <span className="text-xs">({weekday})</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{trip.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Car className="w-3 h-3" /> {trip.distance}km
                </span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {trip.places.length}箇所
                </span>
                {trip.photos.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Camera className="w-3 h-3" /> {trip.photos.length}
                  </span>
                )}
                {trip.voiceMemos.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Mic className="w-3 h-3" /> {trip.voiceMemos.length}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          </div>

          {/* Mini photo strip */}
          {trip.photos.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {trip.photos.slice(0, 3).map(photo => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.caption || ''}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          {/* Mood tag */}
          {trip.mood && (
            <span className="inline-block mt-2 text-xs bg-warm-100 text-warm-700 px-2 py-0.5 rounded-full">
              {trip.mood}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
