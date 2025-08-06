export interface TravelQuery {
  destination: string;
  theme: 'budget' | 'food' | 'culture' | 'nature' | 'luxury' | 'adventure';
  days: 1 | 2;
  groupSize: number;
  additionalInfo?: string;
}

export interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  description: string;
  cost?: string;
  type: 'attraction' | 'food' | 'activity' | 'transport';
}

export interface ItineraryDay {
  day: number;
  title: string;
  items: ItineraryItem[];
}

export interface Itinerary {
  id: string;
  query: TravelQuery;
  title: string;
  description: string;
  days: ItineraryDay[];
  totalBudget?: string;
  tips: string[];
  createdAt: Date;
}