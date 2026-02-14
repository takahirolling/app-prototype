import { ArrowLeft, Car, MapPin, Camera, Star, TrendingUp } from 'lucide-react';
import type { Trip } from '../../types';

interface SummaryReportProps {
  trips: Trip[];
  onBack: () => void;
}

export function SummaryReport({ trips, onBack }: SummaryReportProps) {
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalPlaces = trips.reduce((sum, t) => sum + t.places.length, 0);
  const totalPhotos = trips.reduce((sum, t) => sum + t.photos.length, 0);
  const longTrips = trips.filter(t => t.type === 'longdistance');
  const nearbyTrips = trips.filter(t => t.type === 'nearby');

  const monthlyData: Record<string, { distance: number; trips: number }> = {};
  trips.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { distance: 0, trips: 0 };
    monthlyData[month].distance += t.distance;
    monthlyData[month].trips += 1;
  });

  const allHighlights = trips
    .filter(t => t.highlight)
    .map(t => ({ title: t.title, highlight: t.highlight!, date: t.date, photo: t.photos[0]?.url }));

  return (
    <div className="pb-24 animate-fade-in">
      <div className="sticky top-0 bg-warm-50/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">サマリーレポート</h2>
      </div>

      {/* Hero stats */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-warm-500 to-sunset-600 rounded-2xl p-5 text-white shadow-lg">
          <h3 className="text-sm opacity-80 mb-3">あなたのモビリティライフ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">{totalDistance}<span className="text-sm">km</span></p>
              <p className="text-xs opacity-80">総走行距離</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{trips.length}</p>
              <p className="text-xs opacity-80">お出かけ回数</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{totalPlaces}</p>
              <p className="text-xs opacity-80">訪問場所</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{totalPhotos}</p>
              <p className="text-xs opacity-80">思い出の写真</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip breakdown */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-warm-500" /> ドライブ内訳
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-sunset-50 rounded-xl p-3 text-center">
              <Car className="w-5 h-5 text-sunset-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{longTrips.length}</p>
              <p className="text-xs text-gray-500">長距離ドライブ</p>
            </div>
            <div className="flex-1 bg-forest-50 rounded-xl p-3 text-center">
              <MapPin className="w-5 h-5 text-forest-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{nearbyTrips.length}</p>
              <p className="text-xs text-gray-500">近隣おでかけ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">月別サマリー</h3>
          <div className="space-y-2">
            {Object.entries(monthlyData).sort().map(([month, data]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">{month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-warm-400 to-sunset-500 rounded-full"
                    style={{ width: `${Math.min(100, (data.distance / totalDistance) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-16 text-right">{data.distance}km</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      {allHighlights.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-warm-500" /> ベストモーメント
            </h3>
            <div className="space-y-3">
              {allHighlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  {h.photo && (
                    <img src={h.photo} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{h.title}</p>
                    <p className="text-xs text-warm-600">{h.highlight}</p>
                    <p className="text-xs text-gray-400">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo gallery overview */}
      {totalPhotos > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-500" /> フォトギャラリー
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {trips.flatMap(t => t.photos).slice(0, 9).map(photo => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.caption || ''}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
