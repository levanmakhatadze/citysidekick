import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as Haptics from 'expo-haptics';

export default function Onboarding() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setStatus(status);
    })();
  }, []);

  const request = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setStatus(status);
    if (status === 'granted') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      nav.replace('Home');
    }
  };

  const denyFlow = () => {
    Haptics.selectionAsync();
    nav.replace('Home');
  };

  return (
    <View style={styles.container} accessibilityLabel="onboarding">
      <View style={styles.avatarBubble}>
        <Text style={styles.avatarText}>EchoGuide</Text>
      </View>
      <Text style={styles.title}>Welcome, traveler!</Text>
      <Text style={styles.subtitle}>
        Share your location to discover the essence of your surroundings.
      </Text>
      <TouchableOpacity style={styles.primary} onPress={request} accessibilityRole="button">
        <Text style={styles.primaryText}>Enable Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={denyFlow} accessibilityRole="button">
        <Text style={styles.linkText}>Enter city manually</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Permissions status: {status ?? 'unknown'}</Text>
      <Text style={styles.noteSmall}>You can adjust later in Settings.</Text>
      <Text style={styles.noteSmall}>Platform: {Platform.OS}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0b1020' },
  avatarBubble: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#2b3a70', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#cfe3ff', fontWeight: '600' },
  title: { fontSize: 24, color: '#e8f0ff', fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#c8d6ff', textAlign: 'center', marginBottom: 24 },
  primary: { backgroundColor: '#5aa1ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginBottom: 8 },
  primaryText: { color: '#00112b', fontWeight: '700' },
  link: { padding: 10 },
  linkText: { color: '#a6b9ff', textDecorationLine: 'underline' },
  note: { color: '#9db1ff', marginTop: 16 },
  noteSmall: { color: '#7e8ec9', fontSize: 12, marginTop: 4 },
});
