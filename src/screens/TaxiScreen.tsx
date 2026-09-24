import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Input, Notice, Screen, Sheet } from '../components/UI';
import { Icon } from '../components/Icon';
import { vehicles } from '../data/config';
import { useApp } from '../state/AppProvider';
import { colors, common } from '../theme';
import { estimateFare } from '../utils/events';
import { rideApi, serviceConnected } from '../services/api';
export function TaxiScreen() {
  const { data, update } = useApp();
  const draft = data.rideDraft;
  const [review, setReview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const vehicle = vehicles.find(item => item.id === draft.vehicle);
  const fare = vehicle ? estimateFare(draft.distance, vehicle.rate) : null;
  const valid =
    draft.destination.trim().length >= 3 &&
    Boolean(vehicle) &&
    (!draft.pickupAt || Date.parse(draft.pickupAt) > Date.now());
  const change = (patch: Partial<typeof draft>) =>
    update(current => ({
      ...current,
      rideDraft: { ...current.rideDraft, ...patch },
    }));
  const active =
    data.ride && data.ride.status !== 'cancelled' ? data.ride : null;
  const submit = async () => {
    if (!valid) {
      Alert.alert(
        'Check your ride',
        'Enter a destination, choose a vehicle and select a future pickup time.',
      );
      return;
    }
    if (!serviceConnected) {
      setReview(true);
      return;
    }
    setBusy(true);
    try {
      const ride =
        active && editing
          ? await rideApi.update(active.id, draft)
          : await rideApi.create(draft);
      update(current => ({ ...current, ride }));
      setEditing(false);
      setReview(false);
    } catch (error) {
      Alert.alert(
        'Ride request',
        error instanceof Error ? error.message : 'Unable to submit request.',
      );
    } finally {
      setBusy(false);
    }
  };
  const refresh = async () => {
    if (!active) {
      return;
    }
    setBusy(true);
    try {
      const ride = await rideApi.get(active.id);
      update(current => ({ ...current, ride }));
    } catch (error) {
      Alert.alert(
        'Ride status',
        error instanceof Error ? error.message : 'Unable to refresh.',
      );
    } finally {
      setBusy(false);
    }
  };
  const cancel = () =>
    Alert.alert('Cancel ride?', 'Cancel this ride with the taxi provider?', [
      { text: 'Keep ride', style: 'cancel' },
      {
        text: 'Cancel ride',
        style: 'destructive',
        onPress: async () => {
          if (!active) {
            return;
          }
          setBusy(true);
          try {
            const ride = await rideApi.cancel(active.id);
            update(current => ({ ...current, ride }));
          } catch (error) {
            Alert.alert(
              'Cancellation failed',
              error instanceof Error ? error.message : 'Try again.',
            );
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  if (active && !editing) {
    const bookedVehicle = vehicles.find(item => item.id === active.vehicle);
    return (
      <Screen title="Your Ride">
        <Notice>
          <Text style={{ color: colors.gold, fontWeight: '700' }}>
            {active.status === 'arrived'
              ? 'Your car has arrived'
              : 'Taxi confirmed'}
          </Text>
        </Notice>
        <View style={common.card}>
          {[
            ['Vehicle type', bookedVehicle?.name || active.vehicle],
            ['Destination', active.destination],
            [
              'Pickup',
              active.pickupAt
                ? new Date(active.pickupAt).toLocaleString()
                : 'ASAP',
            ],
            ['Estimated fare', `$${active.estimatedFare.toFixed(2)} CAD`],
            ['Estimated wait', `${active.waitMinutes} min`],
          ].map(([label, value]) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </View>
        <Button
          title="REFRESH RIDE STATUS"
          outline
          busy={busy}
          onPress={refresh}
        />
        {active.status === 'confirmed' && (
          <>
            <Button
              title="CHANGE RIDE"
              outline
              onPress={() => {
                change({
                  destination: active.destination,
                  vehicle: active.vehicle,
                  pickupAt: active.pickupAt,
                  distance: active.distance,
                });
                setEditing(true);
              }}
            />
            <Button
              title="CANCEL RIDE"
              outline
              disabled={busy}
              onPress={cancel}
            />
          </>
        )}
      </Screen>
    );
  }
  return (
    <Screen title={editing ? 'Change Your Ride' : 'Book a Ride'}>
      <Text style={common.muted}>Destination</Text>
      <Input
        accessibilityLabel="Destination"
        placeholder="Type your destination…"
        value={draft.destination}
        onChangeText={destination => change({ destination })}
        maxLength={200}
      />
      <Text style={common.muted}>Vehicle type</Text>
      <View style={{ gap: 8 }}>
        {vehicles.map(item => (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: draft.vehicle === item.id }}
            accessibilityLabel={`${item.name}, ${item.rate.toFixed(
              2,
            )} Canadian dollars per kilometre`}
            key={item.id}
            onPress={() => change({ vehicle: item.id })}
            style={[
              styles.vehicle,
              draft.vehicle === item.id && styles.selected,
            ]}
          >
            <View style={common.flex}>
              <Text
                style={[
                  common.text,
                  { fontSize: 16 },
                  draft.vehicle === item.id && {
                    color: colors.gold,
                    fontWeight: '700',
                  },
                ]}
              >
                {item.name}
              </Text>
              <Text style={common.muted}>${item.rate.toFixed(2)} / km</Text>
            </View>
            {draft.vehicle === item.id && (
              <Icon name="check" color={colors.gold} />
            )}
          </Pressable>
        ))}
      </View>
      <Text style={common.muted}>Pickup</Text>
      <View style={common.row}>
        <View style={common.flex}>
          <Button
            title="ASAP"
            outline={draft.pickupAt !== null}
            onPress={() => change({ pickupAt: null })}
          />
        </View>
        <View style={common.flex}>
          <Button
            title="Schedule"
            outline={draft.pickupAt === null}
            onPress={() => {
              change({
                pickupAt: new Date(Date.now() + 3600000).toISOString(),
              });
              setPicker('date');
            }}
          />
        </View>
      </View>
      {draft.pickupAt && (
        <View style={common.card}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose pickup date"
            onPress={() => setPicker('date')}
          >
            <InfoRow
              label="Date"
              value={new Date(draft.pickupAt).toLocaleDateString()}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose pickup time"
            onPress={() => setPicker('time')}
          >
            <InfoRow
              label="Time"
              value={new Date(draft.pickupAt).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            />
          </Pressable>
          <Text style={[common.muted, { fontSize: 11, padding: 12 }]}>
            Pickup date and time use your device’s time zone.
          </Text>
        </View>
      )}
      <Text style={common.muted}>Trip distance in km (optional)</Text>
      <Input
        accessibilityLabel="Trip distance in kilometres"
        placeholder="Enter distance for a fare estimate"
        keyboardType="decimal-pad"
        value={draft.distance}
        onChangeText={distance => change({ distance })}
        maxLength={7}
      />
      <View style={common.card}>
        <InfoRow
          label="Estimated fare"
          value={fare !== null ? `$${fare.toFixed(2)} CAD` : 'Enter distance'}
        />
        <InfoRow label="Estimated arrival" value="Provided by taxi service" />
      </View>
      {draft.distance.length > 0 && fare === null && (
        <Text style={{ color: colors.gold }}>
          Enter a distance between 0 and 1,000 km and choose a vehicle.
        </Text>
      )}
      <Text style={[common.muted, { fontSize: 12 }]}>
        Estimate uses the selected per-kilometre rate. Provider fees and actual
        route distance may change the final fare.
      </Text>
      {!serviceConnected && (
        <Notice>
          Live taxi booking is not connected. You can save and edit your ride
          plan here; a driver has not been requested.
        </Notice>
      )}
      <Button
        title={
          serviceConnected
            ? editing
              ? 'UPDATE RIDE'
              : 'CONFIRM RIDE'
            : 'SAVE RIDE PLAN'
        }
        disabled={!valid}
        busy={busy}
        onPress={submit}
      />
      {editing && (
        <Button
          title="BACK TO RIDE"
          outline
          onPress={() => setEditing(false)}
        />
      )}
      <Sheet
        visible={review}
        title="Your Ride Plan"
        onClose={() => setReview(false)}
      >
        <Notice>Saved on this device. No taxi has been booked.</Notice>
        <InfoRow label="Destination" value={draft.destination} />
        <InfoRow label="Vehicle" value={vehicle?.name || ''} />
        <InfoRow
          label="Pickup"
          value={
            draft.pickupAt ? new Date(draft.pickupAt).toLocaleString() : 'ASAP'
          }
        />
        <InfoRow
          label="Estimated fare"
          value={
            fare !== null ? `$${fare.toFixed(2)} CAD` : 'Distance not entered'
          }
        />
        <Button title="EDIT PLAN" onPress={() => setReview(false)} />
        <Button
          title="DELETE PLAN"
          outline
          onPress={() => {
            change({
              destination: '',
              vehicle: '',
              pickupAt: null,
              distance: '',
            });
            setReview(false);
          }}
        />
      </Sheet>
      {picker && (
        <Sheet
          visible
          title={picker === 'date' ? 'Pickup Date' : 'Pickup Time'}
          onClose={() => setPicker(null)}
        >
          <DateTimePicker
            value={new Date(draft.pickupAt || Date.now() + 3600000)}
            mode={picker}
            minimumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            themeVariant="dark"
            onChange={(event, date) => {
              if (Platform.OS === 'android') {
                setPicker(null);
              }
              if (event.type !== 'dismissed' && date) {
                change({ pickupAt: date.toISOString() });
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <Button title="DONE" onPress={() => setPicker(null)} />
          )}
        </Sheet>
      )}
    </Screen>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={[common.muted, { fontSize: 12, flex: 1 }]}>{label}</Text>
      <Text
        style={[common.text, { fontSize: 13, textAlign: 'right', flex: 1 }]}
      >
        {value}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  vehicle: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.card,
    borderRadius: 4,
    padding: 18,
    minHeight: 80,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  selected: { borderColor: colors.gold, borderLeftWidth: 3 },
  info: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
