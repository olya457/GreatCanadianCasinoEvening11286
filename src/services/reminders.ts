import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';
import { Event } from '../types';
export const reminderOptions = [
  { minutes: 15, label: '15 minutes before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 120, label: '2 hours before' },
  { minutes: 1440, label: '1 day before' },
];
export async function setReminder(event: Event, minutes: number) {
  const timestamp = Date.parse(event.startAt) - minutes * 60000;
  if (timestamp <= Date.now()) {
    throw new Error(
      'This reminder time has already passed. Choose a later reminder or another event.',
    );
  }
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    throw new Error(
      'Notifications are disabled. Allow notifications for this app in your device settings.',
    );
  }
  const channelId = await notifee.createChannel({
    id: 'events',
    name: 'Event reminders',
    importance: AndroidImportance.HIGH,
  });
  await notifee.createTriggerNotification(
    {
      id: event.id,
      title: event.title,
      body: `Your event starts in ${
        minutes >= 60
          ? `${minutes / 60} hour${minutes === 60 ? '' : 's'}`
          : `${minutes} minutes`
      }. ${event.time} · Toronto time.`,
      android: { channelId, pressAction: { id: 'default' } },
      data: { eventId: event.id },
    },
    { type: TriggerType.TIMESTAMP, timestamp },
  );
}
export async function cancelReminder(id: string) {
  await notifee.cancelNotification(id);
}
