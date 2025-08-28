import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import AdviceSheet from '../components/AdviceSheet';
import { fetchOverpassPOIs } from '../services/pois';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

type Suggestion = { display_name: string; lat: string; lon: string };

export default function MapScreen() {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [theme, setTheme] = useState<'tranquil' | 'urban'>('tranquil');
  const [poiFC, setPoiFC] = useState<any>({ type: 'FeatureCollection', features: [] });
  const lastFetchKey = useRef<string>('');

  useEffect(() => {
    (async () => {
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setCenter([pos.coords.longitude, pos.coords.latitude]);
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!center || (center[0] === 0 && center[1] === 0)) return;
      const key = `${center[0].toFixed(3)},${center[1].toFixed(3)}`;
      if (lastFetchKey.current === key) return;
      lastFetchKey.current = key;
      try {
        const fc = await fetchOverpassPOIs(center[1], center[0], 1500);
        setPoiFC(fc);
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [center]);

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

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: '#cfe3ff', opacity: 0.9, marginBottom: 10 }}>
            Map preview is not available on web. Please run on iOS/Android.
          </Text>
        </View>

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
            />
          )}
        </View>

        <AdviceSheet center={center} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={StyleSheet.absoluteFill} styleURL={theme === 'urban' ? MapboxGL.StyleURL.Street : MapboxGL.StyleURL.Outdoors}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={center} />

        <MapboxGL.ShapeSource id="pois" shape={poiFC}>
          <MapboxGL.CircleLayer
            id="poi-circles"
            style={{
              circleColor: theme === 'urban' ? '#9efcff' : '#8cffc1',
              circleOpacity: 0.7,
              circleRadius: 5,
              circleStrokeColor: theme === 'urban' ? '#00e0ff' : '#46e6a0',
              circleStrokeWidth: 1.5,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <View style={{ position: 'absolute', top: 10, right: 16, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={() => setTheme('tranquil')} style={{ backgroundColor: theme==='tranquil'?'#5aa1ff':'#1a2449', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
          <Text style={{ color: theme==='tranquil'?'#00112b':'#cfe3ff' }}>Tranquil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTheme('urban')} style={{ backgroundColor: theme==='urban'?'#5aa1ff':'#1a2449', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
          <Text style={{ color: theme==='urban'?'#00112b':'#cfe3ff' }}>Urban</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', top: 10, left: 16, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'rgba(12,16,32,0.8)', borderWidth: 1, borderColor: 'rgba(90,161,255,0.25)' }}>
        <Text style={{ color: '#cfe3ff' }}>{center[1].toFixed(3)}, {center[0].toFixed(3)}</Text>
      </View>


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
          />
        )}
      </View>

      <AdviceSheet center={center} />
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
