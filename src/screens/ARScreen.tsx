import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ARScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AR mode coming next (Vision Camera + AR overlays).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  text: { color: '#cfe3ff' },
});
