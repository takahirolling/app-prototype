import { Car, Compass, BookOpen, ChevronRight, MapPin, Camera } from 'lucide-react';
import type { Trip, SwipeRecord } from '../../types';

interface HomePageProps {
  onNavigate: (tab: 'discover' | 'memory') => void;
  trips: Trip[];
  favorites: SwipeRecord[];
  newSuggestionsCount: number;
}

export function HomePage({ onNavigate, trips, favorites, newSuggestionsCount }: HomePageProps) {
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalPlaces = trips.reduce((sum, t) => sum + t.places.length, 0);
  const totalPhotos = trips.reduce((sum, t) => sum + t.photos.length, 0);

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-600/90 to-sunset-600/90" />
        <div className="relative px-6 py-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">MOBI LIFE</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">車のある暮らしを、<br />もっと豊かに。</h1>
          <p className="text-sm opacity-80 leading-relaxed">
            あなたの毎日のドライブが、かけがえのない思い出になる。
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <MapPin className="w-5 h-5 text-sunset-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{totalPlaces}</p>
          <p className="text-xs text-gray-500">訪問場所</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <Car className="w-5 h-5 text-forest-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{totalDistance}<span className="text-xs">km</span></p>
          <p className="text-xs text-gray-500">総走行距離</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <Camera className="w-5 h-5 text-sky-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{totalPhotos}</p>
          <p className="text-xs text-gray-500">思い出の写真</p>
        </div>
      </div>

      {/* Discover Card */}
      <button
        onClick={() => onNavigate('discover')}
        className="w-full bg-white rounded-2xl p-5 mb-4 shadow-sm text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-sunset-100 flex items-center justify-center">
                <Compass className="w-5 h-5 text-sunset-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">お出かけ提案</h2>
                <p className="text-xs text-gray-500">Discover</p>
              </div>
              {newSuggestionsCount > 0 && (
                <span className="ml-2 bg-sunset-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {newSuggestionsCount} NEW
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              あなたにぴったりのお出かけ先を発見。スワイプして気になるスポットを見つけよう。
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />
        </div>
        {favorites.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-sunset-600 font-medium">
              {favorites.length}件のお気に入りスポット
            </p>
          </div>
        )}
      </button>

      {/* Memory Card */}
      <button
        onClick={() => onNavigate('memory')}
        className="w-full bg-white rounded-2xl p-5 mb-4 shadow-sm text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">思い出記録</h2>
                <p className="text-xs text-gray-500">Memory</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              ドライブの思い出を記録して、振り返ろう。写真や音声メモも残せます。
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />
        </div>
        {trips.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-forest-600 font-medium">
              {trips.length}件の思い出を記録中
            </p>
          </div>
        )}
      </button>

      {/* Latest Trip */}
      {trips.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-600 mb-3">最近のお出かけ</h3>
          <div className="flex items-center gap-3">
            {trips[trips.length - 1].photos[0] && (
              <img
                src={trips[trips.length - 1].photos[0].url}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{trips[trips.length - 1].title}</p>
              <p className="text-xs text-gray-500">{trips[trips.length - 1].date} / {trips[trips.length - 1].distance}km</p>
              {trips[trips.length - 1].mood && (
                <span className="inline-block mt-1 text-xs bg-warm-100 text-warm-700 px-2 py-0.5 rounded-full">
                  {trips[trips.length - 1].mood}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
