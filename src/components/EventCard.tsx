import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Event } from '../types';
import { colors, common } from '../theme';
import { getVenue } from '../data/venues';
import { eventDate } from '../utils/events';
import { Button } from './UI';
import { Icon } from './Icon';
export function Schedule({
  event,
  minimal = false,
}: {
  event: Event;
  minimal?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={[
          styles.schedule,
          !minimal && { borderTopWidth: 1, borderColor: colors.border },
        ]}
      >
        <Text
          style={
            minimal ? common.muted : [common.label, { color: colors.text }]
          }
        >
          {minimal ? 'View Schedule' : 'SCHEDULE'}
        </Text>
        <Icon name={open ? 'up' : 'down'} size={16} color={colors.gold} />
      </Pressable>
      {open &&
        event.schedule.map(item => (
          <View key={item.time} style={styles.scheduleRow}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={[common.text, common.flex]}>{item.title}</Text>
          </View>
        ))}
    </View>
  );
}
export function EventCard({
  event,
  onOpen,
  home = false,
}: {
  event: Event;
  onOpen: () => void;
  home?: boolean;
}) {
  return (
    <View style={common.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${event.title}`}
        onPress={onOpen}
      >
        <Image source={event.image} style={styles.image} />
      </Pressable>
      <View style={styles.body}>
        <Text style={common.label}>{getVenue(event.venueId).name}</Text>
        <Text style={common.subtitle}>{event.title}</Text>
        <Text style={styles.meta}>
          {eventDate(event.startAt)} · {event.schedule[0].time}{' '}
          {getVenue(event.venueId).name}
        </Text>
        <Text style={common.muted}>{event.summary}</Text>
        {home ? (
          <Schedule event={event} minimal />
        ) : (
          <View style={{ alignSelf: 'flex-start' }}>
            <Button title="OPEN EVENT" onPress={onOpen} compact />
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 2.25 },
  body: { padding: 16, gap: 10 },
  meta: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  schedule: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  time: { color: colors.gold, fontSize: 12, width: 76 },
});
