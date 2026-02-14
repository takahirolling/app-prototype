import { useState } from 'react';
import { X, Plus, Mic, MicOff, Camera, MapPin } from 'lucide-react';
import type { Trip, VisitedPlace } from '../../types';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface AddTripModalProps {
  onClose: () => void;
  onSave: (trip: Trip) => void;
}

export function AddTripModal({ onClose, onSave }: AddTripModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [route, setRoute] = useState('');
  const [places, setPlaces] = useState<Omit<VisitedPlace, 'id'>[]>([
    { name: '', stayMinutes: 30, category: '' },
  ]);
  const [mood, setMood] = useState('');
  const [highlight, setHighlight] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const { transcript, isListening, isSupported, startListening, stopListening } = useSpeechRecognition();

  const handleAddPlace = () => {
    setPlaces([...places, { name: '', stayMinutes: 30, category: '' }]);
  };

  const handleUpdatePlace = (index: number, field: string, value: string | number) => {
    const updated = [...places];
    updated[index] = { ...updated[index], [field]: value };
    setPlaces(updated);
  };

  const handleAddPhoto = () => {
    const url = prompt('画像URLを入力してください:');
    if (url) {
      setPhotoUrls([...photoUrls, url]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !distance) return;

    const dist = parseInt(distance);
    const trip: Trip = {
      id: `t-${Date.now()}`,
      date,
      title: title.trim(),
      distance: dist,
      type: dist >= 50 ? 'longdistance' : 'nearby',
      route: route || undefined,
      places: places
        .filter(p => p.name.trim())
        .map((p, i) => ({
          ...p,
          id: `p-${Date.now()}-${i}`,
          name: p.name.trim(),
        })),
      photos: photoUrls.map((url, i) => ({
        id: `ph-${Date.now()}-${i}`,
        url,
        timestamp: Date.now(),
      })),
      voiceMemos: transcript
        ? [{ id: `v-${Date.now()}`, text: transcript, timestamp: Date.now() }]
        : [],
      mood: mood || undefined,
      highlight: highlight || undefined,
    };

    onSave(trip);
  };

  const moods = ['楽しい', 'ワクワク', 'リフレッシュ', 'ほっこり', '清々しい', '感動'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end animate-fade-in">
      <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 z-10">
          <h3 className="font-bold text-gray-800">新しい思い出を記録</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">タイトル *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 箱根温泉旅行"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
            />
          </div>

          {/* Date & Distance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">日付 *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">走行距離 (km) *</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
              />
            </div>
          </div>

          {/* Route */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ルート</label>
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="例: 自宅 → 箱根湯本 → 芦ノ湖 → 自宅"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
            />
          </div>

          {/* Places */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />訪問場所
            </label>
            {places.map((place, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={place.name}
                  onChange={(e) => handleUpdatePlace(i, 'name', e.target.value)}
                  placeholder="場所名"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
                />
                <input
                  type="number"
                  value={place.stayMinutes}
                  onChange={(e) => handleUpdatePlace(i, 'stayMinutes', parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-warm-400"
                />
                <span className="text-xs text-gray-500 self-center">分</span>
              </div>
            ))}
            <button
              onClick={handleAddPlace}
              className="text-xs text-warm-600 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 場所を追加
            </button>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              <Camera className="w-3.5 h-3.5 inline mr-1" />写真
            </label>
            <div className="flex gap-2 flex-wrap">
              {photoUrls.map((url, i) => (
                <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ))}
              <button
                onClick={handleAddPhoto}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">気分</label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(mood === m ? '' : m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    mood === m
                      ? 'bg-warm-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ハイライト</label>
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="例: 露天風呂からの絶景"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400"
            />
          </div>

          {/* Voice memo */}
          {isSupported && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">音声メモ</label>
              <div className="flex gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isListening ? 'bg-sunset-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600 min-h-[40px]">
                  {isListening && <span className="inline-block w-2 h-2 bg-sunset-500 rounded-full animate-pulse mr-2" />}
                  {transcript || (isListening ? '話してください...' : '録音ボタンを押して開始')}
                </div>
              </div>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!title.trim() || !distance}
            className="w-full bg-warm-600 text-white rounded-xl py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}
