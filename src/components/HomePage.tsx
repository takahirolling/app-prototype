import { Car, Fuel, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import type { VehicleInfo, UserProfile, DiscoverCard } from '../types';

interface HomePageProps {
  vehicle: VehicleInfo;
  profile: UserProfile;
  discoverCards: DiscoverCard[];
  unreadCount: number;
  onNavigateToDiscover: () => void;
  onCardClick: (cardId: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

export function HomePage({
  vehicle,
  profile,
  discoverCards,
  unreadCount,
  onNavigateToDiscover,
  onCardClick,
}: HomePageProps) {
  const latestSuggestions = discoverCards.filter((c) => !c.isRead).slice(0, 3);
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'こんにちは';
  if (hour < 10) greeting = 'おはようございます';
  else if (hour >= 18) greeting = 'こんばんは';

  return (
    <div className="pb-20 px-4 pt-6">
      {/* Welcome */}
      <div className="animate-slide-up mb-6">
        <p className="text-warm-400 text-sm">{greeting}</p>
        <h1 className="text-xl font-bold text-warm-800 mt-0.5">
          {profile.name}さん、今日も素敵なカーライフを
        </h1>
      </div>

      {/* Vehicle Card */}
      <div className="animate-slide-up bg-gradient-to-br from-warm-50 to-warm-100 rounded-2xl overflow-hidden shadow-sm border border-warm-200/50 mb-6" style={{ animationDelay: '0.1s' }}>
        <div className="relative h-44 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 to-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <p className="text-lg font-bold">{vehicle.name}</p>
            <p className="text-xs opacity-90">{vehicle.grade}</p>
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1">
            <Calendar size={16} className="text-warm-400" />
            <span className="text-[10px] text-warm-400">契約開始</span>
            <span className="text-xs font-medium">{formatDate(vehicle.contractStartDate).slice(0, 8)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-warm-400 text-base">¥</span>
            <span className="text-[10px] text-warm-400">月額</span>
            <span className="text-xs font-medium">{formatCurrency(vehicle.monthlyPayment)}円</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car size={16} className="text-warm-400" />
            <span className="text-[10px] text-warm-400">今月の走行</span>
            <span className="text-xs font-medium">{vehicle.currentMonthMileage}km</span>
          </div>
        </div>
      </div>

      {/* Quick Access - Discover */}
      {latestSuggestions.length > 0 && (
        <div className="animate-slide-up mb-6" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-sunset-500" />
              <h2 className="font-bold text-sm text-warm-800">新着おでかけ提案</h2>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}件
                </span>
              )}
            </div>
            <button
              onClick={onNavigateToDiscover}
              className="text-warm-400 text-xs flex items-center gap-0.5 hover:text-warm-600 transition-colors"
            >
              もっと見る <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {latestSuggestions.map((card) => (
              <button
                key={card.id}
                onClick={() => onCardClick(card.id)}
                className="w-full flex items-center gap-3 bg-white rounded-xl p-2.5 border border-warm-100 hover:border-warm-200 transition-all shadow-sm text-left"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {card.isNew && (
                      <span className="bg-sunset-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] text-warm-400">{card.source}</span>
                  </div>
                  <p className="text-sm font-medium text-warm-800 truncate">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-warm-400 line-clamp-1 mt-0.5">
                    {card.summary}
                  </p>
                </div>
                <ChevronRight size={16} className="text-warm-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Driving Stats */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="font-bold text-sm text-warm-800 mb-3 flex items-center gap-2">
          <Fuel size={16} className="text-leaf-500" />
          ドライブサマリー
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-sky-600">{vehicle.currentMonthMileage}</p>
            <p className="text-[10px] text-sky-600/70 mt-0.5">今月の走行距離 (km)</p>
          </div>
          <div className="bg-gradient-to-br from-leaf-50 to-leaf-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-leaf-600">{vehicle.totalMileage.toLocaleString()}</p>
            <p className="text-[10px] text-leaf-600/70 mt-0.5">総走行距離 (km)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
