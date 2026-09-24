import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';
export function Icon({
  name,
  color = colors.muted,
  size = 24,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const paths: Record<string, string> = {
    home: 'M3 10 12 3l9 7v11h-6v-8H9v8H3Z',
    calendar: 'M4 5h16v16H4ZM4 10h16M8 2v6M16 2v6',
    map: 'm2 5 6-3 8 3 6-3v17l-6 3-8-3-6 3ZM8 2v17M16 5v17',
    car: 'm5 7 2-4h10l2 4 2 4v7H3v-7ZM5 7h14M6 12h2M16 12h2M5 18v3M19 18v3',
    checklist:
      'm2 5 2 2 3-4M10 5h12M2 12l2 2 3-4M10 12h12M2 19l2 2 3-4M10 19h12',
    back: 'm14 5-7 7 7 7',
    down: 'm6 9 6 6 6-6',
    up: 'm6 15 6-6 6 6',
    close: 'm6 6 12 12M6 18 18 6',
    trash: 'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7',
    check: 'm5 12 4 4L19 6',
    music: 'M9 18V5l11-2v13M9 9l11-2',
    dining: 'M4 3v6q0 3 3 3V3M10 3v6q0 3-3 3v9M19 21V3q-5 3-5 9h5',
    pin: 'M12 22S4 14 4 9a8 8 0 1 1 16 0c0 5-8 13-8 13Z',
    spade:
      'M12 3C9 7 3 10 3 14c0 5 6 5 9 1 3 4 9 4 9-1 0-4-6-7-9-11ZM12 15v6M8 21h8',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'help' ? (
        <>
          <Circle cx={12} cy={12} r={10} />
          <Path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5M12 17h.01" />
        </>
      ) : name === 'checkbox' ? (
        <Rect x={3} y={3} width={18} height={18} rx={1} />
      ) : (
        <Path d={paths[name] || paths.home} />
      )}
    </Svg>
  );
}
