import { Reveal } from '../components/ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Polyline } from 'react-native-svg';
import { RootStackParams, TabParams } from '../navigation/types';
import { assets } from '../data/assets';
import { events } from '../data/events';
import { venues } from '../data/venues';
import { VenueId } from '../types';
import { colors, common } from '../theme';
import { Button, Header, Notice, Sheet } from '../components/UI';
import { Icon } from '../components/Icon';
import { eventDate } from '../utils/events';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Map'>,
  NativeStackScreenProps<RootStackParams>
>;
export function MapScreen({ navigation, route }: Props) {
  const layout = useResponsiveLayout();
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const mapWidth = Math.max(
    0,
    Math.min(viewport.width, (viewport.height * 388) / 840),
  );
  const markerWidth = Math.min(100, mapWidth * 0.3);
  const [selected, setSelected] = useState<VenueId | null>(null);
  const [routing, setRouting] = useState<VenueId | null>(null);
  useEffect(() => {
    if (
      route.params?.venueId &&
      venues.some(venue => venue.id === route.params?.venueId)
    ) {
      setSelected(route.params.venueId as VenueId);
      navigation.setParams({ venueId: undefined });
    }
  }, [route.params?.venueId, navigation]);
  const venue = venues.find(item => item.id === selected);
  const destination = venues.find(item => item.id === routing);
  const paths = {
    restaurant: '50,83 50,61 38,58 38,35 25,32 18,13',
    casino: '50,83 50,61 64,58 64,35 78,31 81,13',
    concert: '50,83 50,61 40,57 25,57 16,53',
    club: '50,83 50,61 62,57 76,57 84,53',
  };
  return (
    <View style={common.screen}>
      <Header title="Map" />
      <View style={[styles.mapArea, { padding: layout.spacing }]}>
        <View
          style={styles.viewport}
          onLayout={({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            setViewport(current =>
              current.width === width && current.height === height
                ? current
                : { width, height },
            );
          }}
        >
          {mapWidth > 0 && (
            <Reveal
              style={[
                styles.map,
                { width: mapWidth, height: (mapWidth * 840) / 388 },
              ]}
            >
              <ImageBackground
                source={assets.map}
                resizeMode="contain"
                style={styles.mapImage}
              >
                {routing && (
                  <Svg
                    pointerEvents="none"
                    style={StyleSheet.absoluteFill}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <Polyline
                      points={paths[routing]}
                      stroke="#fff0aa"
                      strokeWidth={1.2}
                      fill="none"
                      strokeDasharray="2 1"
                    />
                  </Svg>
                )}
                {venues.map(item => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Explore ${item.name}`}
                    onPress={() => setSelected(item.id)}
                    style={[
                      styles.marker,
                      {
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: markerWidth,
                        marginLeft: -markerWidth / 2,
                      },
                    ]}
                  >
                    <View style={styles.markerIcon}>
                      <Icon name={item.symbol} color={colors.gold} size={21} />
                    </View>
                    <Text
                      style={[
                        styles.markerLabel,
                        mapWidth < 280 && styles.smallMarkerLabel,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </ImageBackground>
            </Reveal>
          )}
        </View>
      </View>
      {destination && (
        <ScrollView
          style={{ maxHeight: layout.height * 0.26 }}
          contentContainerStyle={[
            styles.routeContent,
            { paddingHorizontal: layout.spacing },
          ]}
        >
          <Notice>
            <Text style={{ color: colors.gold }}>
              Route from the main entrance{'\n'}
            </Text>
            {destination.directions}
          </Notice>
          <Button
            title="CLEAR ROUTE"
            outline
            onPress={() => setRouting(null)}
          />
        </ScrollView>
      )}
      <Text
        style={[
          common.muted,
          styles.hint,
          { paddingHorizontal: layout.spacing },
        ]}
      >
        Tap a venue to explore. Routes start at the main entrance at the bottom
        of the map.
      </Text>
      <Sheet
        visible={Boolean(venue)}
        title={venue?.name || 'Venue'}
        onClose={() => setSelected(null)}
      >
        {venue && (
          <>
            <Image source={venue.image} style={styles.venueImage} />
            <Text style={common.muted}>{venue.description}</Text>
            <Text style={common.muted}>
              <Text style={{ color: colors.gold }}>Opening hours </Text>
              {venue.hours}
            </Text>
            <Text style={common.muted}>{venue.features}</Text>
            <View style={common.separator} />
            <Text style={common.label}>UPCOMING AT THIS VENUE</Text>
            {events
              .filter(
                event =>
                  event.venueId === venue.id &&
                  Date.parse(event.endAt) > Date.now(),
              )
              .map(event => (
                <View
                  key={event.id}
                  style={[styles.event, layout.narrow && styles.compactEvent]}
                >
                  <Image source={event.image} style={styles.thumbnail} />
                  <View style={common.flex}>
                    <Text style={common.text}>{event.title}</Text>
                    <Text style={[common.muted, { fontSize: 11 }]}>
                      {eventDate(event.startAt)} · {event.schedule[0].time}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${event.title}`}
                    onPress={() => {
                      setSelected(null);
                      navigation.navigate('EventDetails', {
                        eventId: event.id,
                      });
                    }}
                    style={[
                      styles.seeMore,
                      layout.narrow && styles.compactMore,
                    ]}
                  >
                    <Text style={common.muted}>See More</Text>
                  </Pressable>
                </View>
              ))}
            {!events.some(
              event =>
                event.venueId === venue.id &&
                Date.parse(event.endAt) > Date.now(),
            ) && (
              <Text style={common.muted}>
                No upcoming events are currently listed.
              </Text>
            )}
            <Button
              title="SHOW ROUTE"
              onPress={() => {
                setRouting(venue.id);
                setSelected(null);
              }}
            />
          </>
        )}
      </Sheet>
    </View>
  );
}
const styles = StyleSheet.create({
  mapArea: { flex: 1, minHeight: 0 },
  viewport: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  map: { borderWidth: 1, borderColor: colors.border, flexShrink: 0 },
  mapImage: { width: '100%', height: '100%' },
  routeContent: { gap: 12, paddingBottom: 12 },
  hint: { fontSize: 12, lineHeight: 18, paddingBottom: 12 },
  smallMarkerLabel: {
    fontSize: 8,
    letterSpacing: 0.4,
    padding: 3,
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
    marginLeft: -50,
    gap: 5,
    minHeight: 60,
  },
  markerIcon: {
    backgroundColor: colors.red,
    borderWidth: 1,
    borderColor: colors.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    backgroundColor: colors.header,
    borderWidth: 1,
    borderColor: colors.gold,
    color: colors.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    padding: 5,
  },
  venueImage: { width: '100%', height: 140 },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 12,
  },
  compactEvent: { flexWrap: 'wrap' },
  thumbnail: { width: 45, height: 45 },
  compactMore: { width: '100%', alignItems: 'center', minHeight: 44 },
  seeMore: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
});
