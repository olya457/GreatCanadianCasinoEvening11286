import { ContentReveal, Reveal } from '../components/ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams, TabParams } from '../navigation/types';
import { assets } from '../data/assets';
import { events } from '../data/events';
import { countdown, eventDate, nextEvent } from '../utils/events';
import { colors, common, serif } from '../theme';
import { EventCard } from '../components/EventCard';
import { Button, Notice } from '../components/UI';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Home'>,
  NativeStackScreenProps<RootStackParams>
>;
export function HomeScreen({ navigation }: Props) {
  const layout = useResponsiveLayout();
  const [now, setNow] = useState(Date.now());
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const event = nextEvent(events, now);
  return (
    <ScrollView
      style={[common.screen, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.top + 28 }}
    >
      <Reveal>
        <Image source={assets.home} style={styles.hero} />
      </Reveal>
      <ContentReveal style={[common.content, layout.contentStyle]}>
        <Text style={common.label}>TONIGHT AT GREAT CANADIAN</Text>
        <Text style={[common.subtitle, { fontWeight: '400' }]}>
          {event ? eventDate(event.startAt, true) : 'Your next evening awaits'}
        </Text>
        {event ? (
          <>
            <View style={[styles.countdown, { padding: layout.spacing }]}>
              <Text style={common.label}>
                {Date.parse(event.startAt) <= now
                  ? 'EVENT IN PROGRESS'
                  : 'NEXT EVENT STARTS IN'}
              </Text>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.clock}>
                {Date.parse(event.startAt) <= now
                  ? 'Enjoy your evening'
                  : countdown(event.startAt, now)}
              </Text>
              <Text style={[common.muted, { fontSize: 11 }]}>
                All event times are in Toronto time
              </Text>
            </View>
            <EventCard
              event={event}
              home
              onOpen={() =>
                navigation.navigate('EventDetails', { eventId: event.id })
              }
            />
          </>
        ) : (
          <Notice>
            There are no upcoming events in the published programme. You can
            still browse the venues and event details.
          </Notice>
        )}
        <View style={layout.rowStyle}>
          <View style={!layout.narrow && common.flex}>
            <Button
              title="EXPLORE EVENTS"
              onPress={() => navigation.navigate('Events')}
            />
          </View>
          <View style={!layout.narrow && common.flex}>
            <Button
              title="EXPLORE COMPLEX"
              outline
              onPress={() => navigation.navigate('Map')}
            />
          </View>
        </View>
      </ContentReveal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 1.94 },
  countdown: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 20,
    gap: 14,
  },
  clock: {
    fontFamily: serif,
    fontWeight: '700',
    fontSize: 36,
    letterSpacing: 3,
    color: colors.gold,
  },
});
