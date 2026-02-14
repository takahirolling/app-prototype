import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Camera, Mic, MessageCircle, Car, Star } from 'lucide-react';
import type { Trip } from '../../types';
import { InterviewModal } from './InterviewModal';

interface TripDetailProps {
  trip: Trip;
  onBack: () => void;
  onUpdateTrip: (trip: Trip) => void;
}

export function TripDetail({ trip, onBack, onUpdateTrip }: TripDetailProps) {
  const [showInterview, setShowInterview] = useState(false);

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-warm-50/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-800 truncate">{trip.title}</h2>
          <p className="text-xs text-gray-500">{trip.date}</p>
        </div>
      </div>

      {/* Hero photo */}
      {trip.photos.length > 0 && (
        <div className="px-4 mb-4">
          <img
            src={trip.photos[0].url}
            alt={trip.photos[0].caption || trip.title}
            className="w-full h-48 object-cover rounded-2xl shadow-md"
          />
        </div>
      )}

      {/* Stats row */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 flex items-center justify-around shadow-sm">
          <div className="text-center">
            <Car className="w-5 h-5 text-warm-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-800">{trip.distance}km</p>
            <p className="text-xs text-gray-500">走行距離</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <MapPin className="w-5 h-5 text-sunset-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-800">{trip.places.length}</p>
            <p className="text-xs text-gray-500">訪問場所</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <Camera className="w-5 h-5 text-sky-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-800">{trip.photos.length}</p>
            <p className="text-xs text-gray-500">写真</p>
          </div>
        </div>
      </div>

      {/* Route */}
      {trip.route && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-warm-500" /> ルート
            </h3>
            <p className="text-sm text-gray-600">{trip.route}</p>
          </div>
        </div>
      )}

      {/* Places visited */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sunset-500" /> 訪問場所
          </h3>
          <div className="space-y-3">
            {trip.places.map((place, index) => (
              <div key={place.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-sunset-100 flex items-center justify-center text-xs font-bold text-sunset-600">
                    {index + 1}
                  </div>
                  {index < trip.places.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{place.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {place.stayMinutes}分
                    </span>
                    {place.category && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">{place.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      {trip.photos.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-500" /> 写真
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {trip.photos.map(photo => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.caption || ''}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  {photo.caption && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{photo.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Voice memos */}
      {trip.voiceMemos.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-forest-500" /> 音声メモ
            </h3>
            <div className="space-y-2">
              {trip.voiceMemos.map(memo => (
                <div key={memo.id} className="bg-forest-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{memo.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(memo.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Highlight */}
      {trip.highlight && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-warm-100 to-sunset-100 rounded-xl p-4">
            <h3 className="text-sm font-bold text-warm-800 mb-1 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-warm-600" /> ハイライト
            </h3>
            <p className="text-sm text-warm-700">{trip.highlight}</p>
          </div>
        </div>
      )}

      {/* Interview button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowInterview(true)}
          className="w-full bg-forest-500 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium shadow-md active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          この思い出について振り返る
        </button>
      </div>

      {showInterview && (
        <InterviewModal
          trip={trip}
          onClose={() => setShowInterview(false)}
          onSave={(memo) => {
            onUpdateTrip({
              ...trip,
              voiceMemos: [...trip.voiceMemos, memo],
            });
            setShowInterview(false);
          }}
        />
      )}
    </div>
  );
}
