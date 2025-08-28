import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import AdviceSheet from '../components/AdviceSheet';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

type Suggestion = { display_name: string; lat: string; lon: string };

export default function MapScreen() {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [theme, setTheme] = useState<'tranquil' | 'urban'>('tranquil');

  useEffect(() => {
    (async () => {
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setCenter([pos.coords.longitude, pos.coords.latitude]);
    })();
  }, []);

  useEffect(() => {
    const run = setTimeout(async () => {
      if (q.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            q
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = (await res.json()) as Suggestion[];
        setSuggestions(data);
      } catch {}
    }, 300);
    return () => clearTimeout(run);
  }, [q]);

  const pick = (s: Suggestion) => {
    setCenter([parseFloat(s.lon), parseFloat(s.lat)]);
    setSuggestions([]);
    setQ(s.display_name);
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={StyleSheet.absoluteFill} styleURL={theme === 'urban' ? MapboxGL.StyleURL.Street : MapboxGL.StyleURL.Outdoors}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={center} />
      </MapboxGL.MapView>

      <View style={styles.searchWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search city or place"
          placeholderTextColor="#aab6d6"
          style={styles.search}
          accessibilityLabel="city-search"
        />
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, idx) => `${item.lat}-${item.lon}-${idx}`}
            style={styles.suggestList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestItem} onPress={() => pick(item)}>
                <Text numberOfLines={1} style={styles.suggestText}>{item.display_name}</Text>
              </TouchableOpacity>
            )}
<View style={{ position: 'absolute', top: 10, right: 16, flexDirection: 'row', gap: 8 }}>
  <TouchableOpacity onPress={() => setTheme('tranquil')} style={{ backgroundColor: theme==='tranquil'?'#5aa1ff':'#1a2449', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
    <Text style={{ color: theme==='tranquil'?'#00112b':'#cfe3ff' }}>Tranquil</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setTheme('urban')} style={{ backgroundColor: theme==='urban'?'#5aa1ff':'#1a2449', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
    <Text style={{ color: theme==='urban'?'#00112b':'#cfe3ff' }}>Urban</Text>
  </TouchableOpacity>
</View>

          />
        )}
      </View>

      <AdviceSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchWrap: { position: 'absolute', top: 50, left: 16, right: 16 },
  search: {
    backgroundColor: 'rgba(15,20,40,0.9)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#e8f0ff',
    borderWidth: 1,
    borderColor: 'rgba(90,161,255,0.3)',
  },
  suggestList: {
    marginTop: 6,
    maxHeight: 220,
    backgroundColor: 'rgba(12,16,32,0.96)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(90,161,255,0.25)',
  },
  suggestItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)' },
  suggestText: { color: '#cfe3ff' },
});
