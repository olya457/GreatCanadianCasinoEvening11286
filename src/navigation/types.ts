import { NavigatorScreenParams } from '@react-navigation/native';
export type TabParams = {
  Home: undefined;
  Events: undefined;
  Map: { venueId?: string } | undefined;
  Taxi: undefined;
  Checklist: undefined;
  Help: undefined;
};
export type RootStackParams = {
  Main: NavigatorScreenParams<TabParams> | undefined;
  EventDetails: { eventId: string };
};
