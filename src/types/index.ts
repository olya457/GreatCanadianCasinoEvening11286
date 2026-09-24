import { ImageSourcePropType } from 'react-native';

export type VenueId = 'restaurant' | 'casino' | 'concert' | 'club';
export type Event = {
  id: string;
  title: string;
  venueId: VenueId;
  date: string;
  time: string;
  startAt: string;
  endAt: string;
  image: ImageSourcePropType;
  summary: string;
  description: string[];
  schedule: { time: string; title: string }[];
};
export type ChecklistItem = { id: string; title: string; checked: boolean };
export type RideDraft = {
  destination: string;
  vehicle: string;
  pickupAt: string | null;
  distance: string;
};
export type Ride = RideDraft & {
  id: string;
  status: 'confirmed' | 'cancelled' | 'arrived';
  estimatedFare: number;
  waitMinutes: number;
  createdAt: string;
};
export type Message = {
  id: string;
  text: string;
  role: 'user' | 'operator' | 'assistant';
  status?: 'saved' | 'sent' | 'answered';
  requestId?: string;
};
export type AppData = {
  onboarded: boolean;
  checklist: ChecklistItem[];
  reminders: Record<string, number>;
  rideDraft: RideDraft;
  ride: Ride | null;
  messages: Message[];
};
