import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from '../src/state/AppProvider';
import { ChecklistScreen } from '../src/screens/ChecklistScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('../src/components/ContentReveal', () => ({
  ContentReveal: require('react-native').View,
  Reveal: require('react-native').View,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('checklist can add, check, persist and reset user items', async () => {
  let tree: TestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = TestRenderer.create(
      <AppProvider>
        <ChecklistScreen />
      </AppProvider>,
    );
  });
  expect(
    tree!.root.findAll(
      node =>
        node.props.accessibilityRole === 'checkbox' &&
        typeof node.props.onPress === 'function',
    ),
  ).toHaveLength(8);
  await act(async () => {
    tree!.root
      .findAll(
        node =>
          node.props.accessibilityLabel === 'New checklist item' &&
          typeof node.props.onChangeText === 'function',
      )[0]
      .props.onChangeText('Coat');
  });
  await act(async () => {
    tree!.root
      .findAll(node => typeof node.props.onPress === 'function')
      .find(node => node.props.accessibilityLabel === 'ADD ITEM')!
      .props.onPress();
  });
  const checkbox = () =>
    tree!.root
      .findAll(node => typeof node.props.onPress === 'function')
      .find(node => node.props.accessibilityLabel === 'Coat')!;
  await act(async () => {
    checkbox().props.onPress();
  });
  expect(checkbox().props.accessibilityState.checked).toBe(true);
  const saved = JSON.parse(
    (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1],
  );
  expect(
    saved.checklist.find((item: { title: string }) => item.title === 'Coat')
      .checked,
  ).toBe(true);
  await act(async () => {
    tree!.root
      .findAll(node => typeof node.props.onPress === 'function')
      .find(node => node.props.accessibilityLabel === 'Reset Checklist')!
      .props.onPress();
  });
  expect(checkbox().props.accessibilityState.checked).toBe(false);
  await act(async () => tree!.unmount());
});
