import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ARScreen() {
  return (
    <View style={styles.container} accessibilityLabel="ar-placeholder" accessibilityRole="summary">
      <Text style={styles.title}>AR Preview</Text>
      <Text style={styles.text}>
        Build a Dev Client to enable camera-based AR (Vision Camera). In Expo Go, this screen is a placeholder.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020', padding: 24 },
  title: { color: '#e6f0ff', fontWeight: '700', fontSize: 18, marginBottom: 8 },
  text: { color: '#cfe3ff', textAlign: 'center' },
});
