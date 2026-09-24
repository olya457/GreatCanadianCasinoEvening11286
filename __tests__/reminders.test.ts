import notifee from '@notifee/react-native';
import { events } from '../src/data/events';
import { cancelReminder, setReminder } from '../src/services/reminders';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    createChannel: jest.fn().mockResolvedValue('events'),
    createTriggerNotification: jest.fn().mockResolvedValue('event-1'),
    cancelNotification: jest.fn().mockResolvedValue(undefined),
  },
  AuthorizationStatus: { DENIED: 0 },
  AndroidImportance: { HIGH: 4 },
  TriggerType: { TIMESTAMP: 0 },
}));
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-09-24T12:00:00Z'));
});
afterEach(() => jest.restoreAllMocks());
test('schedules the chosen reminder relative to the event instant', async () => {
  await setReminder(events[0], 60);
  expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
    expect.objectContaining({ id: events[0].id }),
    expect.objectContaining({
      timestamp: Date.parse(events[0].startAt) - 3600000,
    }),
  );
  await cancelReminder(events[0].id);
  expect(notifee.cancelNotification).toHaveBeenCalledWith(events[0].id);
});
test('past reminders never reach the notification scheduler', async () => {
  jest.spyOn(Date, 'now').mockReturnValue(Date.parse(events[0].startAt));
  await expect(setReminder(events[0], 15)).rejects.toThrow('already passed');
  expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
});
test('denied permission does not create a reminder', async () => {
  (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
    authorizationStatus: 0,
  });
  await expect(setReminder(events[0], 15)).rejects.toThrow('disabled');
  expect(notifee.createTriggerNotification).not.toHaveBeenCalled();
});
