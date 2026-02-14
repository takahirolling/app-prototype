import type { SeasonFilter } from '../../types';
import { seasonLabels } from '../../data/mockData';

interface FilterBarProps {
  activeFilter: SeasonFilter;
  onFilterChange: (filter: SeasonFilter) => void;
}

const filters: SeasonFilter[] = ['all', 'weekend', 'nextmonth', 'spring', 'summer', 'autumn', 'winter'];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
            ${activeFilter === filter
              ? 'bg-warm-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
            }`}
        >
          {seasonLabels[filter]}
        </button>
      ))}
    </div>
  );
}
