import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import { useRoute } from '@react-navigation/native';
import { askEchoGuide } from '../services/ai';
import { loadPrefs } from '../store/prefs';
import { transcribeAudio } from '../services/stt';
import { ensureAnonUser, addHistory } from '../services/user';

export default function ChatScreen() {
  const route = useRoute<any>();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [rec, setRec] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    if (route.params?.preset) {
      const p = String(route.params.preset);
      setInput(p);
    }
  }, [route.params]);

  const toggleRecord = async () => {
    try {
      if (!isRecording) {
        const perm = await Audio.requestPermissionsAsync();
        if (perm.status !== 'granted') return;
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const recording = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRec(recording.recording);
        setIsRecording(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        if (rec) {
          await rec.stopAndUnloadAsync();
          const uri = rec.getURI()!;
          setIsRecording(false);
          setRec(null);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          try {
            const text = await transcribeAudio(uri);
            if (text) setInput(text);
          } catch {}
        } else {
          setIsRecording(false);
        }
      }
    } catch {
      setIsRecording(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setHistory(h => [...h, { role: 'user', content: text }]);

    const prefs = await loadPrefs();
    const uid = await ensureAnonUser();
    try {
      const { getDailyAIUsage, incrementDailyAIUsage } = await import('../services/user');
      const limit = Number(process.env.EXPO_PUBLIC_FREE_DAILY_AI_LIMIT || 10);
      const usage = await getDailyAIUsage(uid);
      if (usage.count >= limit) {
        setHistory(h => [...h, { role: 'ai', content: 'Daily free AI limit reached. Upgrade to continue.' }]);
        return;
      }
      await incrementDailyAIUsage(uid);
    } catch {}

    const reply = await askEchoGuide(text, { tone: prefs.tone });
    setHistory(h => [...h, { role: 'ai', content: reply }]);
    try { await addHistory(uid, text, reply); } catch {}
    Speech.speak(reply, { pitch: 1, rate: 1 });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16 }}>
        {history.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === 'user' ? styles.user : styles.ai]}>
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
        <TouchableOpacity
          style={[styles.send, isRecording && styles.sendActive]}
          onPress={toggleRecord}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop voice input' : 'Start voice input'}
        >
          <Text style={styles.sendText}>{isRecording ? 'Stop' : 'Mic'}</Text>
        </TouchableOpacity>
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
  sendActive: { backgroundColor: '#7dc3ff' },
  sendText: { color: '#00112b', fontWeight: '700' },
  bubble: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#27408f' },
  ai: { alignSelf: 'flex-start', backgroundColor: '#1a2449' },
  bubbleText: { color: '#e6f0ff' },
});
