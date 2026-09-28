import { Reveal } from '../components/ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigation/types';
import { events } from '../data/events';
import { venues } from '../data/venues';
import { EventCard } from '../components/EventCard';
import { Header } from '../components/UI';
import { colors, common } from '../theme';
export function EventsScreen() {
  const layout = useResponsiveLayout();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [filter, setFilter] = useState('all');
  return (
    <View style={common.screen}>
      <Header title="Upcoming Events" />
      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: layout.spacing, gap: 8 }}
        >
          {[{ id: 'all', name: 'All' }, ...venues].map(venue => (
            <Pressable
              key={venue.id}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === venue.id }}
              onPress={() => setFilter(venue.id)}
              style={[styles.chip, filter === venue.id && styles.selected]}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === venue.id && { color: colors.text },
                ]}
              >
                {venue.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Reveal style={common.flex} replayKey={filter}>
        <FlatList
          data={events.filter(
            event => filter === 'all' || event.venueId === filter,
          )}
          keyExtractor={event => event.id}
          contentContainerStyle={[common.content, layout.contentStyle]}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onOpen={() =>
                navigation.navigate('EventDetails', { eventId: item.id })
              }
            />
          )}
        />
      </Reveal>
    </View>
  );
}
const styles = StyleSheet.create({
  filters: { backgroundColor: colors.header, paddingBottom: 20 },
  chip: {
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  selected: { backgroundColor: colors.selected, borderColor: colors.selected },
  chipText: { fontSize: 12, color: colors.muted, letterSpacing: 0.4 },
});
