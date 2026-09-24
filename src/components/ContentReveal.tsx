import React, {
  Children,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  replayKey?: string | number;
};
function useEntrance(replayKey?: string | number) {
  const progress = useRef(new Animated.Value(0)).current;
  const navigation = useContext(NavigationContext);
  useEffect(() => {
    let active = true;
    let reduceMotion = false;
    let animation: Animated.CompositeAnimation | undefined;
    const play = () => {
      animation?.stop();
      if (reduceMotion) {
        progress.setValue(1);
        return;
      }
      progress.setValue(0);
      animation = Animated.timing(progress, {
        toValue: 1,
        duration: 680,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      animation.start();
    };
    const preference = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reduced => {
        reduceMotion = reduced;
        if (reduced) {
          animation?.stop();
          progress.setValue(1);
        }
      },
    );
    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduced => {
        if (!active) {
          return;
        }
        reduceMotion = reduced;
        if (!navigation || navigation.isFocused()) {
          play();
        }
      })
      .catch(() => {
        if (active) {
          play();
        }
      });
    const unsubscribe = navigation?.addListener('focus', play);
    return () => {
      active = false;
      animation?.stop();
      preference.remove();
      unsubscribe?.();
    };
  }, [navigation, progress, replayKey]);
  return progress;
}
function flatten(
  children: React.ReactNode,
  prefix = '',
): { node: React.ReactNode; key: string }[] {
  return Children.toArray(children).flatMap((node, index) => {
    const key = `${prefix}${
      isValidElement(node) && node.key !== null ? node.key : index
    }`;
    return isValidElement<{ children?: React.ReactNode }>(node) &&
      node.type === Fragment
      ? flatten(node.props.children, `${key}/`)
      : [{ node, key }];
  });
}
export function ContentReveal({ children, style, replayKey }: Props) {
  const progress = useEntrance(replayKey);
  return (
    <View style={style}>
      {flatten(children).map(({ node, key }, index) => {
        if (
          isValidElement<{ visible?: boolean }>(node) &&
          typeof node.props.visible === 'boolean'
        ) {
          return <Fragment key={key}>{node}</Fragment>;
        }
        const start = Math.min(index, 7) * 0.045;
        const inputRange = [start, Math.min(start + 0.65, 1)];
        return (
          <Animated.View
            key={key}
            style={{
              opacity: progress.interpolate({
                inputRange,
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange,
                    outputRange: [22, 0],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange,
                    outputRange: [0.985, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          >
            {node}
          </Animated.View>
        );
      })}
    </View>
  );
}
export function Reveal({ children, style, replayKey }: Props) {
  const progress = useEntrance(replayKey);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
