import { User, Car, MapPin, Users, Heart, Settings, ChevronRight } from 'lucide-react';
import type { UserProfile, VehicleInfo } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  vehicle: VehicleInfo;
  favoriteCount: number;
  swipeCount: number;
}

export function ProfilePage({ profile, vehicle, favoriteCount, swipeCount }: ProfilePageProps) {
  return (
    <div className="pb-20 pt-6 px-4">
      <h1 className="text-lg font-bold text-warm-800 mb-6">プロフィール</h1>

      {/* User Card */}
      <div className="animate-slide-up bg-gradient-to-br from-warm-100 to-warm-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-warm-300 flex items-center justify-center">
            <User size={28} className="text-warm-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-warm-800">{profile.name}さん</p>
            <p className="text-xs text-warm-500 flex items-center gap-1">
              <MapPin size={12} /> {profile.prefecture}
            </p>
            <p className="text-xs text-warm-500 flex items-center gap-1 mt-0.5">
              <Users size={12} /> 家族{profile.familySize}人
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="animate-slide-up mb-6" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-bold text-warm-700 mb-3 flex items-center gap-2">
          <Car size={16} /> マイカー情報
        </h2>
        <div className="bg-white rounded-xl border border-warm-100 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-36 object-cover"
          />
          <div className="p-4">
            <p className="font-bold text-warm-800">{vehicle.name}</p>
            <p className="text-xs text-warm-400">{vehicle.grade}</p>
            <p className="text-xs text-warm-400 mt-1">{vehicle.color}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-slide-up grid grid-cols-2 gap-3 mb-6" style={{ animationDelay: '0.15s' }}>
        <div className="bg-warm-50 rounded-xl p-4 text-center">
          <Heart size={18} className="mx-auto text-rose-400 mb-1" />
          <p className="text-xl font-bold text-warm-700">{favoriteCount}</p>
          <p className="text-[10px] text-warm-400">お気に入り</p>
        </div>
        <div className="bg-warm-50 rounded-xl p-4 text-center">
          <Compass size={18} className="mx-auto text-sky-400 mb-1" />
          <p className="text-xl font-bold text-warm-700">{swipeCount}</p>
          <p className="text-[10px] text-warm-400">チェック済み</p>
        </div>
      </div>

      {/* Interests */}
      <div className="animate-slide-up mb-6" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-bold text-warm-700 mb-3">興味・関心</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="bg-warm-100 text-warm-600 text-xs px-3 py-1.5 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <h2 className="text-sm font-bold text-warm-700 mb-3 flex items-center gap-2">
          <Settings size={16} /> 設定
        </h2>
        <div className="bg-white rounded-xl border border-warm-100 divide-y divide-warm-50">
          {['通知設定', 'プライバシー設定', '利用規約', 'お問い合わせ'].map((item) => (
            <button
              key={item}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-warm-600 hover:bg-warm-50 transition-colors"
            >
              {item}
              <ChevronRight size={16} className="text-warm-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Compass({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}
