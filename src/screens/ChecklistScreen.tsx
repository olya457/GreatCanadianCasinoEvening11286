import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../state/AppProvider';
import { Button, Input, Screen, Sheet } from '../components/UI';
import { colors, common } from '../theme';
import { Icon } from '../components/Icon';
export function ChecklistScreen() {
  const layout = useResponsiveLayout();
  const { data, update } = useApp();
  const [title, setTitle] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const add = () => {
    if (!title.trim()) {
      return;
    }
    update(current => ({
      ...current,
      checklist: [
        ...current.checklist,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: title.trim(),
          checked: false,
        },
      ],
    }));
    setTitle('');
  };
  return (
    <Screen title="Evening Checklist">
      <Text style={common.label}>
        {data.checklist.filter(item => item.checked).length} OF{' '}
        {data.checklist.length} READY
      </Text>
      <View style={common.card}>
        {data.checklist.length === 0 && (
          <Text style={[common.muted, { padding: 16 }]}>
            Your checklist is empty. Add an item below.
          </Text>
        )}
        {data.checklist.map(item => (
          <View style={styles.row} key={item.id}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
              accessibilityLabel={item.title}
              onPress={() =>
                update(current => ({
                  ...current,
                  checklist: current.checklist.map(entry =>
                    entry.id === item.id
                      ? { ...entry, checked: !entry.checked }
                      : entry,
                  ),
                }))
              }
              style={styles.item}
            >
              <View
                style={[
                  styles.checkbox,
                  item.checked && {
                    backgroundColor: colors.green,
                    borderColor: colors.green,
                  },
                ]}
              >
                {item.checked && (
                  <Icon name="check" size={16} color={colors.background} />
                )}
              </View>
              <Text
                style={[
                  common.text,
                  common.flex,
                  item.checked && styles.checked,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.title}`}
              onPress={() => setDeleting(item.id)}
              style={styles.delete}
            >
              <Icon name="trash" size={16} />
            </Pressable>
          </View>
        ))}
      </View>
      <View style={layout.rowStyle}>
        <Input
          accessibilityLabel="New checklist item"
          placeholder="Add another item"
          value={title}
          onChangeText={setTitle}
          maxLength={120}
          onSubmitEditing={add}
          returnKeyType="done"
          style={!layout.narrow && common.flex}
        />
        <Button title="ADD ITEM" onPress={add} disabled={!title.trim()} />
      </View>
      <Button
        title="Reset Checklist"
        outline
        onPress={() =>
          update(current => ({
            ...current,
            checklist: current.checklist.map(item => ({
              ...item,
              checked: false,
            })),
          }))
        }
      />
      <Sheet
        visible={Boolean(deleting)}
        title="Delete Item?"
        onClose={() => setDeleting(null)}
      >
        <Text style={common.muted}>
          Delete “{data.checklist.find(item => item.id === deleting)?.title}”
          from your checklist?
        </Text>
        <View style={common.row}>
          <View style={common.flex}>
            <Button
              title="CONFIRM"
              onPress={() => {
                update(current => ({
                  ...current,
                  checklist: current.checklist.filter(
                    item => item.id !== deleting,
                  ),
                }));
                setDeleting(null);
              }}
            />
          </View>
          <View style={common.flex}>
            <Button title="CANCEL" outline onPress={() => setDeleting(null)} />
          </View>
        </View>
      </Sheet>
    </Screen>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 16,
    minHeight: 50,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  checked: { textDecorationLine: 'line-through', color: colors.muted },
  delete: { padding: 16, minHeight: 48, justifyContent: 'center' },
});
