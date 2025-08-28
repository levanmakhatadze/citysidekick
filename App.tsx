import React from 'react';
import { Platform } from 'react-native';
import RootNavigation from './src/navigation';

if (Platform.OS === 'web') {
  require('mapbox-gl/dist/mapbox-gl.css');
}

export default function App() {
  return <RootNavigation />;
}
