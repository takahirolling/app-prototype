export interface VehicleInfo {
  name: string;
  grade: string;
  image: string;
  contractStartDate: string;
  monthlyPayment: number;
  currentMonthMileage: number;
  totalMileage: number;
  color: string;
}

export interface DiscoverCard {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: DiscoverCategory;
  source: string;
  sourceCredit?: string;
  isRead: boolean;
  isNew: boolean;
  createdAt: string;
  season?: Season;
  details?: string;
  estimatedDriveTime?: string;
  estimatedDistance?: string;
  tags: string[];
  mapUrl?: string;
}

export type DiscoverCategory =
  | 'drive'
  | 'gourmet'
  | 'nature'
  | 'event'
  | 'family'
  | 'movie'
  | 'magazine';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export type TimeFilter = 'all' | 'this-weekend' | 'next-month' | 'spring' | 'summer' | 'autumn' | 'winter';

export interface SwipeRecord {
  cardId: string;
  direction: 'right' | 'left';
  timestamp: string;
}

export interface UserProfile {
  name: string;
  familySize: number;
  hasChildren: boolean;
  prefecture: string;
  interests: string[];
}

export type TabId = 'home' | 'discover' | 'memory' | 'profile';

export interface AppState {
  currentTab: TabId;
  vehicle: VehicleInfo;
  profile: UserProfile;
  discoverCards: DiscoverCard[];
  favorites: string[];
  swipeHistory: SwipeRecord[];
  discoverSubPage: 'swipe' | 'favorites' | 'detail';
  selectedCardId: string | null;
  activeFilter: TimeFilter;
}
