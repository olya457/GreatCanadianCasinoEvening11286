import { events } from '../src/data/events';
import { countdown, estimateFare, nextEvent } from '../src/utils/events';

test('the supplied programme contains three complete events per venue', () => {
  expect(events).toHaveLength(12);
  for (const venue of ['restaurant', 'casino', 'concert', 'club']) {
    expect(events.filter(event => event.venueId === venue)).toHaveLength(3);
  }
  for (const event of events) {
    expect(event.description).toHaveLength(2);
    expect(event.schedule).toHaveLength(5);
    expect(Date.parse(event.endAt)).toBeGreaterThan(Date.parse(event.startAt));
  }
});

test('next event includes an ongoing event and excludes ended events', () => {
  const event = events[0];
  expect(nextEvent(events, Date.parse(event.startAt) + 1000)?.id).toBe(
    event.id,
  );
  expect(nextEvent(events, Date.parse(event.endAt))?.id).toBe(events[1].id);
  expect(nextEvent(events, Date.parse(events[11].endAt))).toBeUndefined();
});

test('countdown handles days and never shows negative values', () => {
  expect(
    countdown('2026-09-26T19:00:00Z', Date.parse('2026-09-25T16:45:24Z')),
  ).toBe('1d  02 : 14 : 36');
  expect(
    countdown('2026-09-26T19:00:00Z', Date.parse('2026-09-27T19:00:00Z')),
  ).toBe('00 : 00 : 00');
});

test('fares use entered distance and reject missing or invalid distances', () => {
  expect(estimateFare('20', 2.2)).toBe(44);
  expect(estimateFare('2,5', 1.5)).toBe(3.75);
  for (const input of ['', '-2', 'NaN', 'Infinity', '1001']) {
    expect(estimateFare(input, 2)).toBeNull();
  }
});
