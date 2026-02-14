import { BookImage, Camera, MapPin, Clock } from 'lucide-react';

export function MemoryPage() {
  return (
    <div className="pb-20 pt-6 px-4">
      <h1 className="text-lg font-bold text-warm-800 mb-6">Memory</h1>

      <div className="flex flex-col items-center justify-center py-16 text-warm-300">
        <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-5">
          <BookImage size={36} className="text-warm-300" />
        </div>
        <p className="text-base font-medium text-warm-500 mb-2">思い出記録</p>
        <p className="text-xs text-warm-400 text-center leading-relaxed max-w-[250px]">
          あなたのドライブの思い出を記録・振り返る機能です。近日公開予定。
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-[280px]">
          <div className="flex flex-col items-center gap-1.5 text-warm-200">
            <div className="w-12 h-12 rounded-xl bg-warm-50 flex items-center justify-center">
              <Camera size={20} />
            </div>
            <span className="text-[10px]">写真</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-warm-200">
            <div className="w-12 h-12 rounded-xl bg-warm-50 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <span className="text-[10px]">場所</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-warm-200">
            <div className="w-12 h-12 rounded-xl bg-warm-50 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-[10px]">タイムライン</span>
          </div>
        </div>
      </div>
    </div>
  );
}
