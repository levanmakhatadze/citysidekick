import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tone = 'witty' | 'serene' | 'neutral';
export type Prefs = { tone: Tone };

const KEY = 'citysidekick:prefs';

export async function savePrefs(p: Prefs) {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}

export async function loadPrefs(): Promise<Prefs> {
  const s = await AsyncStorage.getItem(KEY);
  if (!s) return { tone: 'neutral' };
  try {
    return JSON.parse(s) as Prefs;
  } catch {
    return { tone: 'neutral' };
  }
}
