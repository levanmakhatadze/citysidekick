import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { askEchoGuide } from '../services/ai';
import { loadPrefs } from '../store/prefs';
import { useRoute } from '@react-navigation/native';
import { ensureAnonUser, addHistory } from '../services/user';

export default function ChatScreen() {
  const route = useRoute<any>();
  const [input, setInput] = useState('');
  useEffect(() => {
    if (route.params?.preset) {
      const p = String(route.params.preset);
      setInput(p);
    }
  }, [route.params]);
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);

    const uid = await ensureAnonUser();

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setHistory(h => [...h, { role: 'user', content: text }]);
    const prefs = await loadPrefs();
    const reply = await askEchoGuide(text, { tone: prefs.tone });
    setHistory(h => [...h, { role: 'ai', content: reply }]);
    try { await addHistory(uid, text, reply); } catch {}
    Speech.speak(reply, { pitch: 1, rate: 1 });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
        {history.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role==='user'? styles.user: styles.ai]}>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask EchoGuide..."
          placeholderTextColor="#8ca4e6"
          style={styles.input}
          accessibilityLabel="chat-input"
        />
        <TouchableOpacity style={styles.send} onPress={send} accessibilityRole="button">
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020' },
  scroll: { flex: 1 },
  row: { flexDirection: 'row', padding: 12, gap: 8 },
  input: { flex: 1, backgroundColor: '#121a36', borderRadius: 10, paddingHorizontal: 12, color: '#e8f0ff', borderWidth: 1, borderColor: 'rgba(90,161,255,0.3)' },
  send: { backgroundColor: '#5aa1ff', borderRadius: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#00112b', fontWeight: '700' },
  bubble: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#27408f' },
  ai: { alignSelf: 'flex-start', backgroundColor: '#1a2449' },
  bubbleText: { color: '#e6f0ff' },
});
