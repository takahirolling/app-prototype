export interface SuggestionCard {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: 'drive' | 'event' | 'gourmet' | 'nature' | 'culture' | 'family';
  source: 'ai' | 'magazine' | 'event';
  sourceLabel?: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  distance?: string;
  duration?: string;
  tags: string[];
}

export interface SwipeRecord {
  cardId: string;
  direction: 'right' | 'left';
  timestamp: number;
}

export interface Trip {
  id: string;
  date: string;
  title: string;
  distance: number;
  type: 'nearby' | 'longdistance';
  route?: string;
  places: VisitedPlace[];
  photos: Photo[];
  voiceMemos: VoiceMemo[];
  mood?: string;
  highlight?: string;
}

export interface VisitedPlace {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
  stayMinutes: number;
  category?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  placeId?: string;
  timestamp: number;
}

export interface VoiceMemo {
  id: string;
  text: string;
  timestamp: number;
  duration?: number;
}

export interface UserProfile {
  familySize: number;
  children: number;
  interests: string[];
  homeArea: string;
}

export type TabType = 'home' | 'discover' | 'memory';
export type SeasonFilter = 'all' | 'weekend' | 'nextmonth' | 'spring' | 'summer' | 'autumn' | 'winter';
