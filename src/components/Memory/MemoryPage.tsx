import { useState, useMemo } from 'react';
import { Plus, BarChart3, Calendar } from 'lucide-react';
import type { Trip } from '../../types';
import { TripCard } from './TripCard';
import { TripDetail } from './TripDetail';
import { SummaryReport } from './SummaryReport';
import { AddTripModal } from './AddTripModal';

interface MemoryPageProps {
  trips: Trip[];
  onUpdateTrips: (trips: Trip[]) => void;
}

export function MemoryPage({ trips, onUpdateTrips }: MemoryPageProps) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'month'>('timeline');

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [trips]
  );

  const groupedTrips = useMemo(() => {
    const groups: Record<string, Trip[]> = {};
    sortedTrips.forEach(trip => {
      const month = trip.date.substring(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(trip);
    });
    return groups;
  }, [sortedTrips]);

  const handleUpdateTrip = (updatedTrip: Trip) => {
    onUpdateTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    setSelectedTrip(updatedTrip);
  };

  const handleAddTrip = (newTrip: Trip) => {
    onUpdateTrips([...trips, newTrip]);
    setShowAddTrip(false);
  };

  if (showReport) {
    return <SummaryReport trips={trips} onBack={() => setShowReport(false)} />;
  }

  if (selectedTrip) {
    return (
      <TripDetail
        trip={selectedTrip}
        onBack={() => setSelectedTrip(null)}
        onUpdateTrip={handleUpdateTrip}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">思い出記録</h1>
          <p className="text-xs text-gray-500">{trips.length}件のお出かけを記録中</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'timeline' ? 'month' : 'timeline')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'month' ? 'bg-warm-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddTrip(true)}
            className="p-2 rounded-full bg-warm-600 text-white shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trip list */}
      {trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-warm-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">まだ思い出がありません</p>
          <p className="text-sm text-gray-400 mb-4">最初のお出かけを記録しましょう</p>
          <button
            onClick={() => setShowAddTrip(true)}
            className="px-5 py-2 bg-warm-600 text-white rounded-full text-sm font-medium"
          >
            思い出を記録する
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="space-y-3">
          {sortedTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onSelect={setSelectedTrip} />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedTrips).sort((a, b) => b[0].localeCompare(a[0])).map(([month, monthTrips]) => {
            const [year, m] = month.split('-');
            return (
              <div key={month}>
                <h3 className="text-sm font-bold text-gray-500 mb-2">
                  {year}年{parseInt(m)}月
                  <span className="font-normal ml-2 text-gray-400">{monthTrips.length}件</span>
                </h3>
                <div className="space-y-3">
                  {monthTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} onSelect={setSelectedTrip} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddTrip && (
        <AddTripModal
          onClose={() => setShowAddTrip(false)}
          onSave={handleAddTrip}
        />
      )}
    </div>
  );
}
