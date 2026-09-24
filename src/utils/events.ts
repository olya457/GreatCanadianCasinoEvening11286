import { Event } from '../types';
import { config } from '../data/config';

export function nextEvent(events: Event[], now = Date.now()) {
  return [...events]
    .filter(event => Date.parse(event.endAt) > now)
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))[0];
}
export function eventDate(date: string, full = false) {
  return new Date(date).toLocaleDateString('en-CA', {
    timeZone: config.timeZone,
    weekday: full ? 'long' : 'short',
    month: full ? 'long' : 'short',
    day: 'numeric',
  });
}
export function countdown(startAt: string, now: number) {
  const seconds = Math.max(0, Math.floor((Date.parse(startAt) - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const clock = [
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map(n => String(n).padStart(2, '0'))
    .join(' : ');
  return `${days ? `${days}d  ` : ''}${clock}`;
}
export function estimateFare(distance: string, rate: number) {
  const km = Number(distance.replace(',', '.'));
  return Number.isFinite(km) && km > 0 && km <= 1000
    ? Math.round(km * rate * 100) / 100
    : null;
}
