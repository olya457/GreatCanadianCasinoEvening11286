import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';

const key = '@great-canadian/evening/v1';
export const initialData: AppData = {
  onboarded: false,
  checklist: [
    'ID or passport',
    'Event ticket',
    'Phone',
    'Wallet',
    'Power bank',
    'Car keys',
    'Dress code outfit',
    'Reservation details',
  ].map((title, index) => ({ id: `default-${index}`, title, checked: false })),
  reminders: {},
  rideDraft: { destination: '', vehicle: '', pickupAt: null, distance: '' },
  ride: null,
  messages: [],
};
type Context = {
  data: AppData;
  ready: boolean;
  error: string | null;
  update: (change: (data: AppData) => AppData) => void;
  retrySave: () => void;
};
const AppContext = createContext<Context | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const queue = useRef(Promise.resolve());
  const hydrated = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(raw => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            !parsed ||
            !Array.isArray(parsed.checklist) ||
            !Array.isArray(parsed.messages) ||
            typeof parsed.onboarded !== 'boolean'
          ) {
            throw new Error('Invalid storage');
          }
          setData({ ...initialData, ...parsed });
        }
        hydrated.current = true;
      })
      .catch(() =>
        setError('Saved data could not be loaded. Restart the app to retry.'),
      )
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready || !hydrated.current) {
      return;
    }
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(key, JSON.stringify(data)))
      .then(() => setError(null))
      .catch(() => setError('Changes could not be saved. Tap to retry.'));
  }, [data, ready, revision]);
  return (
    <AppContext.Provider
      value={{
        data,
        ready,
        error,
        update: setData,
        retrySave: () => setRevision(value => value + 1),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('AppProvider is required');
  }
  return value;
}
