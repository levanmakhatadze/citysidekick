import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { getCurrentWeather } from '../services/openweather';
import { askEchoGuide } from '../services/ai';
import { loadPrefs } from '../store/prefs';
import { useNavigation } from '@react-navigation/native';

type Props = {
  center?: [number, number];
  advice?: string;
};

export default function AdviceSheet({ center, advice }: Props) {
  const snapPoints = useMemo(() => ['12%', '40%', '80%'], []);
  const ref = useRef<BottomSheet>(null);
  const [text, setText] = useState<string | null>(advice ?? null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation<any>();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!center || (center[0] === 0 && center[1] === 0)) return;
      if (text) return;
      try {
        setLoading(true);
        const w = await getCurrentWeather(center[1], center[0]);
        const prefs = await loadPrefs();
        const prompt = `User is at lon=${center[0].toFixed(3)}, lat=${center[1].toFixed(3)}. Weather: ${w.tempC}°C, ${w.description}. 
Suggest one nearby relaxing destination and an outfit. Add a short eco-insight encouraging a low-carbon option.`;
        const resp = await askEchoGuide(prompt, { tone: prefs.tone });
        if (!cancelled) setText(resp);
      } catch {
        if (!cancelled) setText('Unable to fetch advice right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [center]);

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints} index={0} enablePanDownToClose={false}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>EchoGuide</Text>
        {loading ? (
          <View style={{ paddingVertical: 8 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Text style={styles.body}>{text || 'Ask for nearby parks, cafes, or outfit tips.'}</Text>
        )}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.btn}
            onPress={() => {
              const p = text ? `Expand on this plan: ${text}` : 'Suggest a nearby park and outfit.';
              nav.navigate('Home', { screen: 'Chat', params: { preset: p } });
            }}
          >
            <Text style={styles.btnText}>Open in Chat</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8 },
  heading: { color: '#0b1020', fontWeight: '700', fontSize: 16 },
  body: { color: '#233b6e' },
  btn: { backgroundColor: '#5aa1ff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#00112b', fontWeight: '700' },
});
