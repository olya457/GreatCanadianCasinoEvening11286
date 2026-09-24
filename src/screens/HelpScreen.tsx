import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Input, Notice, Screen } from '../components/UI';
import { Icon } from '../components/Icon';
import { faqs } from '../data/faq';
import { colors, common } from '../theme';
import { useApp } from '../state/AppProvider';
import { serviceConnected, supportApi } from '../services/api';
import { Message } from '../types';
export function HelpScreen() {
  const layout = useResponsiveLayout();
  const { data, update } = useApp();
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const send = async () => {
    const text = question.trim();
    if (!text || busy) {
      return;
    }
    const id = `message-${Date.now()}`;
    const message: Message = { id, text, role: 'user', status: 'saved' };
    update(current => ({
      ...current,
      messages: [...current.messages, message],
    }));
    setQuestion('');
    const match = faqs.find(item =>
      item.keywords.some(keyword => text.toLowerCase().includes(keyword)),
    );
    if (match) {
      update(current => ({
        ...current,
        messages: [
          ...current.messages,
          { id: `${id}-faq`, text: match.answer, role: 'assistant' },
        ],
      }));
    }
    if (!serviceConnected) {
      return;
    }
    setBusy(true);
    try {
      const result = await supportApi.send(text, id);
      update(current => ({
        ...current,
        messages: current.messages.map(item =>
          item.id === id
            ? { ...item, status: 'sent', requestId: result.requestId }
            : item,
        ),
      }));
    } catch (error) {
      Alert.alert(
        'Question saved, not sent',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };
  const refresh = async () => {
    setBusy(true);
    try {
      for (const message of data.messages.filter(
        item => item.role === 'user',
      )) {
        let requestId = message.requestId;
        if (!requestId) {
          const sent = await supportApi.send(message.text, message.id);
          requestId = sent.requestId;
          update(current => ({
            ...current,
            messages: current.messages.map(item =>
              item.id === message.id
                ? { ...item, requestId, status: 'sent' }
                : item,
            ),
          }));
        }
        const replies = await supportApi.replies(requestId);
        update(current => ({
          ...current,
          messages: [
            ...current.messages.map(item =>
              item.id === message.id && replies.length
                ? { ...item, status: 'answered' as const }
                : item,
            ),
            ...replies
              .filter(
                reply => !current.messages.some(item => item.id === reply.id),
              )
              .map(reply => ({ ...reply, role: 'operator' as const })),
          ],
        }));
      }
    } catch (error) {
      Alert.alert(
        'Operator support',
        error instanceof Error ? error.message : 'Unable to refresh.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen title="Help & FAQ">
      <View style={[common.card, styles.chat]}>
        {data.messages.length === 0 ? (
          <>
            <Text style={common.subtitle}>How can we help?</Text>
            <Text style={common.muted}>
              Choose a topic or write your question. Answers from the FAQ are
              labelled automatically.
            </Text>
          </>
        ) : (
          data.messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.bubble,
                message.role === 'user' ? styles.user : styles.reply,
              ]}
            >
              <Text
                style={[
                  common.label,
                  { color: message.role === 'user' ? '#f5dce0' : colors.gold },
                ]}
              >
                {message.role === 'user'
                  ? 'YOU'
                  : message.role === 'operator'
                  ? 'OPERATOR'
                  : 'FAQ ANSWER · AUTOMATIC'}
              </Text>
              <Text style={common.text}>{message.text}</Text>
              {message.status && (
                <Text
                  style={[
                    common.muted,
                    {
                      fontSize: 10,
                      color: message.role === 'user' ? '#f5dce0' : colors.muted,
                    },
                  ]}
                >
                  {message.status === 'saved'
                    ? 'Saved on device · Not sent'
                    : message.status === 'sent'
                    ? 'Sent · Awaiting operator'
                    : 'Answered'}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {[
          'Event location',
          'Dress code',
          'Parking',
          'Accessibility',
          'Reservations',
        ].map(topic => (
          <Pressable
            accessibilityRole="button"
            key={topic}
            onPress={() => setQuestion(topic)}
            style={styles.topic}
          >
            <Text style={common.muted}>{topic}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={layout.rowStyle}>
        <Input
          accessibilityLabel="Your question"
          placeholder="Ask a question"
          value={question}
          onChangeText={setQuestion}
          maxLength={2000}
          multiline
          style={[!layout.narrow && common.flex, { maxHeight: 120 }]}
        />
        <Button
          title={serviceConnected ? 'SEND' : 'SAVE'}
          disabled={!question.trim()}
          busy={busy}
          onPress={send}
        />
      </View>
      {serviceConnected ? (
        <Button
          title="SEND SAVED QUESTIONS & CHECK REPLIES"
          outline
          busy={busy}
          onPress={refresh}
        />
      ) : (
        <Notice>
          Operator support is not connected. Questions stay on this device. FAQ
          answers are automatic and are not operator replies.
        </Notice>
      )}
      <Text style={common.label}>FREQUENTLY ASKED</Text>
      <View style={common.card}>
        {faqs.map((faq, index) => (
          <View key={faq.question} style={styles.faq}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: expanded.includes(index) }}
              onPress={() =>
                setExpanded(current =>
                  current.includes(index)
                    ? current.filter(item => item !== index)
                    : [...current, index],
                )
              }
              style={styles.question}
            >
              <Text style={[common.text, common.flex]}>{faq.question}</Text>
              <Icon
                name={expanded.includes(index) ? 'up' : 'down'}
                size={16}
                color={colors.gold}
              />
            </Pressable>
            {expanded.includes(index) && (
              <Text style={[common.muted, styles.answer]}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  chat: { padding: 16, gap: 12, minHeight: 155 },
  bubble: { maxWidth: '92%', padding: 13, gap: 6, borderRadius: 4 },
  user: { alignSelf: 'flex-end', backgroundColor: colors.red },
  reply: {
    alignSelf: 'flex-start',
    backgroundColor: colors.header,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topic: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 10,
  },
  faq: { borderBottomWidth: 1, borderColor: colors.border },
  question: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  answer: { paddingHorizontal: 16, paddingBottom: 16 },
});
