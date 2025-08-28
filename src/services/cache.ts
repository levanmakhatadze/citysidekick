import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheEntry<T> = { v: T; e: number };

export async function setCached<T>(key: string, value: T, ttlMs: number) {
  const entry: CacheEntry<T> = { v: value, e: Date.now() + ttlMs };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

export async function getCached<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.e) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return entry.v as T;
  } catch {
    return null;
  }
}

export function cacheKey(parts: (string | number)[]) {
  return `cs:${parts.join(':')}`;
}
