import { useWindowDimensions, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useResponsiveLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableWidth = width - insets.left - insets.right;
  const narrow = usableWidth < 375 || fontScale > 1.25;
  const compact = usableWidth < 390 || height < 720;
  const spacing = narrow ? 12 : compact ? 16 : 20;
  const gap = compact ? 14 : 18;
  const contentStyle: ViewStyle = {
    paddingHorizontal: spacing,
    paddingTop: spacing,
    paddingBottom: compact ? 24 : 32,
    gap,
  };
  const rowStyle: ViewStyle = {
    flexDirection: narrow ? 'column' : 'row',
    alignItems: narrow ? 'stretch' : 'center',
    gap: 10,
  };
  return {
    width,
    height,
    fontScale,
    narrow,
    compact,
    spacing,
    gap,
    contentStyle,
    rowStyle,
    titleSize: narrow ? 25 : compact ? 28 : 30,
  };
}
