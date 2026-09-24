import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, common } from '../theme';
import { Icon } from './Icon';
import { ContentReveal, Reveal } from './ContentReveal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export function Button({
  title,
  onPress,
  outline = false,
  disabled = false,
  busy = false,
  compact = false,
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
  busy?: boolean;
  compact?: boolean;
}) {
  const { compact: smallScreen } = useResponsiveLayout();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        styles.button,
        outline && styles.outline,
      ]}
    >
      <View
        style={[
          styles.buttonInner,
          (smallScreen || compact) && styles.compactButton,
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={
            outline ? ['transparent', 'transparent'] : ['#e0b655', '#cfa043']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {busy ? (
          <ActivityIndicator
            color={outline ? colors.gold : colors.background}
          />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { color: outline ? colors.gold : colors.background },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
export function Header({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const { compact, spacing, titleSize } = useResponsiveLayout();
  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + (compact ? 16 : 28),
          paddingHorizontal: spacing,
          paddingBottom: compact ? 16 : 22,
        },
      ]}
    >
      <Reveal>
        <Text
          accessibilityRole="header"
          style={[common.title, { fontSize: titleSize }]}
        >
          {title}
        </Text>
      </Reveal>
    </View>
  );
}
export function Screen({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { contentStyle } = useResponsiveLayout();
  return (
    <KeyboardAvoidingView
      style={common.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {title && <Header title={title} />}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <ContentReveal style={[common.content, contentStyle]}>
          {children}
        </ContentReveal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      selectionColor={colors.gold}
      {...props}
      style={[common.input, props.style]}
    />
  );
}
export function Sheet({
  visible,
  onClose,
  children,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  const insets = useSafeAreaInsets();
  const { spacing, height } = useResponsiveLayout();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.overlay,
          { paddingHorizontal: spacing },
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close dialog"
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              maxHeight: Math.max(
                160,
                height - insets.top - insets.bottom - 32,
              ),
            },
          ]}
        >
          <View style={common.between}>
            <Text style={[common.subtitle, { flex: 1 }]}>{title}</Text>
            <Pressable
              onPress={onClose}
              accessibilityLabel="Close"
              style={styles.close}
            >
              <Icon name="close" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetScroll}
          >
            <ContentReveal
              replayKey={String(visible)}
              style={styles.sheetContent}
            >
              {children}
            </ContentReveal>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.notice}>
      <Text style={common.muted}>{children}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  compactButton: { paddingHorizontal: 12, minHeight: 44 },
  button: { borderRadius: 4, overflow: 'hidden', flexShrink: 0 },
  outline: { borderWidth: 1, borderColor: colors.gold },
  buttonInner: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  header: {
    backgroundColor: colors.header,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#020810dd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    width: '100%',
    maxWidth: 540,
    maxHeight: '95%',
    gap: 16,
  },
  sheetContent: { gap: 16 },
  sheetScroll: { paddingBottom: 4 },
  close: { padding: 10, minWidth: 44, minHeight: 44 },
  notice: {
    backgroundColor: colors.card,
    padding: 16,
    borderLeftWidth: 2,
    borderColor: colors.gold,
  },
});
