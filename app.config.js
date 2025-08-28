/** @type {import('@expo/config').ExpoConfig} */
module.exports = ({ config }) => {
  const appName = 'CitySidekick';
  const useMapboxPlugin = process.env.EXPO_USE_MAPBOX_PLUGIN === '1';
  const plugins = [];

  if (useMapboxPlugin) {
    plugins.push([
      '@rnmapbox/maps-expo-plugin',
      {
        android: {
          accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
          locationWhenInUsePermission: 'Allow CitySidekick to access your location.',
        },
        ios: {
          accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
          locationWhenInUsePermission: 'Allow CitySidekick to access your location.',
        },
      },
    ]);
  }

  return {
    ...config,
    name: appName,
    slug: 'citysidekick',
    scheme: 'citysidekick',
    runtimeVersion: { policy: 'sdkVersion' },
    extra: {
      eas: { projectId: process.env.EAS_PROJECT_ID || '' },
    },
    experiments: {
      typedRoutes: false,
    },
    plugins,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'CitySidekick uses your location to show nearby places and guidance.',
        NSCameraUsageDescription: 'Camera access enables AR insights.',
        NSSpeechRecognitionUsageDescription: 'Speech recognition enables voice chat.',
        NSMicrophoneUsageDescription: 'Microphone access enables voice chat.',
      },
    },
    android: {
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'CAMERA',
        'RECORD_AUDIO',
        'INTERNET',
        'VIBRATE',
      ],
      package: 'com.citysidekick.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      softwareKeyboardLayoutMode: 'pan',
    },
    web: {
      favicon: './assets/favicon.png',
    },
  };
};
