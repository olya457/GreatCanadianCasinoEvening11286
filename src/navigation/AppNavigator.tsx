import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import notifee, { EventType } from '@notifee/react-native';
import { RootStackParams, TabParams } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { EventDetailsScreen } from '../screens/EventDetailsScreen';
import { MapScreen } from '../screens/MapScreen';
import { TaxiScreen } from '../screens/TaxiScreen';
import { ChecklistScreen } from '../screens/ChecklistScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { Icon } from '../components/Icon';
import { colors } from '../theme';
const Stack = createNativeStackNavigator<RootStackParams>();
const Tabs = createBottomTabNavigator<TabParams>();
const navigationRef = createNavigationContainerRef<RootStackParams>();
const tabs: { name: keyof TabParams; label: string; icon: string }[] = [
  { name: 'Home', label: 'Tonight', icon: 'home' },
  { name: 'Events', label: 'Events', icon: 'calendar' },
  { name: 'Map', label: 'Map', icon: 'map' },
  { name: 'Taxi', label: 'Taxi', icon: 'car' },
  { name: 'Checklist', label: 'Evening Checklist', icon: 'checklist' },
  { name: 'Help', label: 'Help and FAQ', icon: 'help' },
];
function BottomBar({ state, navigation }: BottomTabBarProps) {
  return (
    <TabButtons
      active={state.routes[state.index].name}
      onPress={name => {
        const route = state.routes.find(item => item.name === name)!;
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!event.defaultPrevented) {
          navigation.navigate(name);
        }
      }}
    />
  );
}
function TabButtons({
  active,
  onPress,
}: {
  active: string;
  onPress: (name: keyof TabParams) => void;
}) {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  if (keyboardVisible) {
    return null;
  }
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) + 20 }]}>
      {tabs.map(tab => (
        <Pressable
          key={tab.name}
          accessibilityRole="tab"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: active === tab.name }}
          onPress={() => onPress(tab.name)}
          style={styles.tab}
        >
          {active === tab.name && <View style={styles.indicator} />}
          <Icon
            name={tab.icon}
            color={active === tab.name ? colors.accent : colors.muted}
            size={22}
          />
        </Pressable>
      ))}
    </View>
  );
}
function MainTabs() {
  return (
    <Tabs.Navigator
      tabBar={BottomBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Events" component={EventsScreen} />
      <Tabs.Screen name="Map" component={MapScreen} />
      <Tabs.Screen name="Taxi" component={TaxiScreen} />
      <Tabs.Screen name="Checklist" component={ChecklistScreen} />
      <Tabs.Screen name="Help" component={HelpScreen} />
    </Tabs.Navigator>
  );
}
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.header,
    text: colors.text,
    primary: colors.accent,
    border: colors.border,
  },
};
export function AppNavigator() {
  useEffect(
    () =>
      notifee.onForegroundEvent(({ type, detail }) => {
        if (
          type === EventType.PRESS &&
          typeof detail.notification?.data?.eventId === 'string' &&
          navigationRef.isReady()
        ) {
          navigationRef.navigate('EventDetails', {
            eventId: detail.notification.data.eventId,
          });
        }
      }),
    [],
  );
  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      onReady={() => {
        notifee
          .getInitialNotification()
          .then(initial => {
            const id = initial?.notification.data?.eventId;
            if (typeof id === 'string') {
              navigationRef.navigate('EventDetails', { eventId: id });
            }
          })
          .catch(() => undefined);
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.accent,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetails"
          options={{ title: 'Events', headerBackTitle: 'Events' }}
        >
          {props => (
            <View style={{ flex: 1 }}>
              <EventDetailsScreen {...props} />
              <TabButtons
                active="Events"
                onPress={name =>
                  props.navigation.navigate('Main', { screen: name })
                }
              />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.header,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 0,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    width: 28,
    backgroundColor: colors.selected,
  },
});
