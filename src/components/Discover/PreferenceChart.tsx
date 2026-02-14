import type { SwipeRecord } from '../../types';
import type { SuggestionCard } from '../../types';
import { categoryLabels } from '../../data/mockData';

interface PreferenceChartProps {
  swipeHistory: SwipeRecord[];
  suggestions: SuggestionCard[];
}

export function PreferenceChart({ swipeHistory, suggestions }: PreferenceChartProps) {
  const likedIds = new Set(
    swipeHistory.filter(s => s.direction === 'right').map(s => s.cardId)
  );

  const categoryCounts: Record<string, number> = {};
  for (const id of likedIds) {
    const card = suggestions.find(s => s.id === id);
    if (card) {
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
    }
  }

  const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...entries.map(e => e[1]), 1);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">スワイプ履歴がまだありません</p>
        <p className="text-xs text-gray-400 mt-1">カードをスワイプすると嗜好パターンが表示されます</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3">あなたの嗜好パターン</h3>
      <div className="space-y-2.5">
        {entries.map(([category, count]) => (
          <div key={category} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-16 text-right flex-shrink-0">
              {categoryLabels[category] || category}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-warm-400 to-sunset-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">{count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">
        合計 {swipeHistory.length} スワイプ / {likedIds.size} お気に入り
      </p>
    </div>
  );
}
