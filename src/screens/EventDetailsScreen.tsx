import { ContentReveal, Reveal } from '../components/ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/types';
import { events } from '../data/events';
import { getVenue } from '../data/venues';
import { colors, common } from '../theme';
import { eventDate } from '../utils/events';
import { Schedule } from '../components/EventCard';
import { Button, Sheet } from '../components/UI';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppProvider';
import {
  cancelReminder,
  reminderOptions,
  setReminder,
} from '../services/reminders';
export function EventDetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParams, 'EventDetails'>) {
  const layout = useResponsiveLayout();
  const event = events.find(item => item.id === route.params.eventId);
  const { data, update } = useApp();
  const [options, setOptions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selection, setSelection] = useState(
    data.reminders[route.params.eventId] || 60,
  );
  if (!event) {
    return (
      <View style={common.content}>
        <Text style={common.text}>Event unavailable.</Text>
      </View>
    );
  }
  const venue = getVenue(event.venueId);
  const enabled = data.reminders[event.id] !== undefined;
  const change = async (on: boolean, minutes = selection) => {
    setBusy(true);
    try {
      if (on) {
        await setReminder(event, minutes);
      } else {
        await cancelReminder(event.id);
      }
      update(current => {
        const reminders = { ...current.reminders };
        if (on) {
          reminders[event.id] = minutes;
        } else {
          delete reminders[event.id];
        }
        return { ...current, reminders };
      });
      setSelection(minutes);
    } catch (error) {
      Alert.alert(
        'Event reminder',
        error instanceof Error ? error.message : 'Unable to update reminder.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <ScrollView style={common.screen}>
      <Reveal replayKey={event.id}>
        <Image source={event.image} style={styles.image} />
      </Reveal>
      <ContentReveal
        replayKey={event.id}
        style={[common.content, layout.contentStyle]}
      >
        <Text style={common.label}>{venue.name}</Text>
        <Text style={[common.title, { fontSize: layout.titleSize }]}>
          {event.title}
        </Text>
        <Text style={common.muted}>
          {eventDate(event.startAt)} · {event.time}
          {'\n'}Location: {venue.name} · Toronto time
        </Text>
        <Schedule event={event} />
        {event.description.map(paragraph => (
          <Text key={paragraph} style={common.muted}>
            {paragraph}
          </Text>
        ))}
        <View style={[common.card, styles.reminder]}>
          <Text style={[common.label, { color: colors.text }]}>
            EVENT REMINDER
          </Text>
          <View style={common.between}>
            <Text style={common.muted}>
              {busy ? 'Updating reminder…' : 'Notify me'}
            </Text>
            <Switch
              accessibilityLabel="Notify me about this event"
              value={enabled}
              disabled={busy || Date.parse(event.startAt) < Date.now()}
              onValueChange={on => change(on)}
              trackColor={{ false: '#153454', true: colors.gold }}
              thumbColor={colors.background}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose reminder time"
            disabled={busy}
            onPress={() => setOptions(true)}
            style={styles.select}
          >
            <Text style={[common.text, common.flex]}>
              {
                reminderOptions.find(option => option.minutes === selection)
                  ?.label
              }
            </Text>
            <Icon name="down" size={16} />
          </Pressable>
        </View>
        <Text style={common.subtitle}>{venue.name}</Text>
        <Text style={common.muted}>{venue.description}</Text>
        <Button
          title="VIEW ON CASINO MAP"
          outline
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Map',
              params: { venueId: venue.id },
            })
          }
        />
      </ContentReveal>
      <Sheet
        visible={options}
        title="Remind me"
        onClose={() => setOptions(false)}
      >
        {reminderOptions.map(option => (
          <Button
            key={option.minutes}
            title={option.label}
            outline={selection !== option.minutes}
            onPress={() => {
              setOptions(false);
              if (enabled) {
                change(true, option.minutes);
              } else {
                setSelection(option.minutes);
              }
            }}
          />
        ))}
      </Sheet>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 1.8 },
  reminder: { padding: 16, gap: 16, borderRadius: 4 },
  select: {
    backgroundColor: colors.header,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 46,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
