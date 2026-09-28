import React, { useState } from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/state/AppProvider';
import { SplashScreen, OnboardingScreen } from './src/screens/WelcomeScreens';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors, common } from './src/theme';
function AppContent() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { data, ready, error, retrySave } = useApp();
  return (
    <View style={common.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {!splashFinished || !ready ? (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      ) : data.onboarded ? (
        <AppNavigator />
      ) : (
        <OnboardingScreen />
      )}
      {error && (
        <Pressable
          onPress={retrySave}
          accessibilityRole="button"
          style={{ padding: 12, backgroundColor: colors.selected }}
        >
          <Text style={common.text}>{error}</Text>
        </Pressable>
      )}
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
