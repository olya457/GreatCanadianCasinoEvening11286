import { Platform, StyleSheet } from 'react-native';
export const colors = {
  background: '#06121f',
  header: '#0d1d2e',
  card: '#14273b',
  border: '#293b4d',
  text: '#f5f1e8',
  muted: '#9ba9b9',
  gold: '#d9ac4c',
  red: '#b7253d',
  green: '#4da586',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif' })!;
export const common = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
    width: '100%',
    maxWidth: 660,
    alignSelf: 'center',
  },
  title: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  text: { color: colors.text, fontSize: 14, lineHeight: 22 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 23 },
  label: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 48,
    fontSize: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  separator: { height: 1, backgroundColor: colors.border },
});
