import { ContentReveal, Reveal } from '../components/ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { assets } from '../data/assets';
import { colors, common, serif } from '../theme';
import { Button } from '../components/UI';
import { useApp } from '../state/AppProvider';

const loadingHtml =
  '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{background:transparent;margin:0;height:100%;overflow:hidden}body{display:flex;align-items:center;justify-content:center}.spinner{width:32px;height:32px;position:relative;animation:spin 1.1s linear infinite}.spinner i{position:absolute;width:7px;height:7px;border-radius:50%;background:#d9ac4c;left:13px;top:0;transform-origin:3px 16px}.spinner i:nth-child(2){transform:rotate(60deg);opacity:.8}.spinner i:nth-child(3){transform:rotate(120deg);opacity:.6}.spinner i:nth-child(4){transform:rotate(180deg);opacity:.4}.spinner i:nth-child(5){transform:rotate(240deg);opacity:.2}.spinner i:nth-child(6){transform:rotate(300deg);opacity:.1}@keyframes spin{to{transform:rotate(360deg)}}</style></head><body><div class="spinner"><i></i><i></i><i></i><i></i><i></i><i></i></div><script>setTimeout(function(){window.ReactNativeWebView.postMessage("finished")},4000)</script></body></html>';
export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { height, width } = useWindowDimensions();
  const layout = useResponsiveLayout();
  const finished = useRef(false);
  const finish = () => {
    if (!finished.current) {
      finished.current = true;
      onFinish();
    }
  };
  useEffect(() => {
    const fallback = setTimeout(finish, 5500);
    return () => clearTimeout(fallback);
  });
  return (
    <ImageBackground source={assets.splash} style={common.flex}>
      <LinearGradient
        colors={['#00000005', '#00000022', '#000000ee']}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.splashScroll}>
        <ContentReveal
          style={[
            styles.splash,
            {
              gap: layout.compact ? 10 : 18,
              paddingVertical: layout.compact ? 18 : 24,
            },
          ]}
        >
          <Image
            source={assets.logo}
            style={{
              width: Math.min(
                width * 0.76,
                height * (layout.compact ? 0.3 : 0.36),
                340,
              ),
              height: Math.min(
                width * 0.76,
                height * (layout.compact ? 0.3 : 0.36),
                340,
              ),
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#d9ac4c55',
            }}
          />
          <Text style={styles.ornament}>──── ◇ ────</Text>
          <Text style={[styles.brand, { fontSize: height < 650 ? 28 : 36 }]}>
            Great Canadian
          </Text>
          <Text style={styles.evening}>EVENING</Text>
          <Text style={styles.ornament}>──── ◇ ────</Text>
          <View style={styles.spinner}>
            <WebView
              source={{ html: loadingHtml }}
              originWhitelist={['about:blank']}
              scrollEnabled={false}
              style={styles.webview}
              onMessage={event => {
                if (event.nativeEvent.data === 'finished') {
                  finish();
                }
              }}
              onError={finish}
            />
          </View>
        </ContentReveal>
      </ScrollView>
    </ImageBackground>
  );
}
const pages = [
  {
    title: 'Discover Your\nEvening',
    text: 'Explore exclusive events across the restaurant, casino, concert hall, and club.',
  },
  {
    title: 'Follow Every\nMoment',
    text: 'View complete event schedules, set reminders, and plan your evening with ease.',
  },
  {
    title: 'Explore the\nComplex',
    text: 'Use the interactive map to find every venue and discover what is happening nearby.',
  },
  {
    title: 'Leave with\nEase',
    text: 'Plan a taxi, prepare your checklist, and enjoy a smooth experience from arrival to departure.',
  },
];
export function OnboardingScreen() {
  const layout = useResponsiveLayout();
  const [page, setPage] = useState(0);
  const { update } = useApp();
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground source={assets.onboarding[page]} style={common.flex}>
      <LinearGradient
        colors={['transparent', '#00000011', '#000000ee']}
        locations={[0, 0.35, 1]}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={common.flex}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.onboarding,
          {
            paddingBottom: layout.gap,
            paddingTop: insets.top + layout.spacing,
            paddingHorizontal: layout.spacing,
          },
        ]}
      >
        <ContentReveal
          replayKey={page}
          style={[
            styles.copy,
            {
              paddingTop: Math.min(230, layout.height * 0.24),
              gap: layout.gap,
            },
          ]}
        >
          <Text style={[common.title, { fontSize: layout.titleSize }]}>
            {pages[page].title}
          </Text>
          <Text style={[common.text, { fontSize: 15, lineHeight: 26 }]}>
            {pages[page].text}
          </Text>
          <View style={styles.dots}>
            {pages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === page ? colors.gold : '#ffffff55',
                  },
                ]}
              />
            ))}
          </View>
        </ContentReveal>
      </ScrollView>
      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: layout.spacing,
            paddingBottom: insets.bottom + layout.spacing,
          },
        ]}
      >
        <Reveal replayKey={page} style={styles.footerContent}>
          <Button
            title={page === 3 ? 'START EXPLORING' : 'CONTINUE'}
            onPress={() =>
              page < 3
                ? setPage(page + 1)
                : update(data => ({ ...data, onboarded: true }))
            }
          />
        </Reveal>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  splashScroll: { flexGrow: 1, justifyContent: 'center' },
  splash: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 24,
  },
  ornament: { color: colors.gold, letterSpacing: 2, marginTop: 10 },
  brand: {
    fontFamily: serif,
    color: colors.gold,
    textAlign: 'center',
    fontWeight: '700',
  },
  evening: {
    fontFamily: serif,
    color: colors.gold,
    letterSpacing: 5,
    fontSize: 19,
  },
  spinner: { height: 54, width: 70 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  onboarding: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  footer: { flexShrink: 0, paddingTop: 8 },
  footerContent: { width: '100%', maxWidth: 580, alignSelf: 'center' },
  copy: {
    gap: 18,
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingTop: 230,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
