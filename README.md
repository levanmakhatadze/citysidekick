# CitySidekick (Expo + React Native)

Location-based discovery with AI companion.

## Prerequisites
- Node 18 (use \`nvm use\`)
- Expo CLI (\`npm i -g expo-cli\` optional)
- Android Studio / Xcode (for emulators)

## Setup
- cp .env.example .env
- Fill in EXPO_PUBLIC_* keys
  - EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=...
  - EXPO_PUBLIC_OPENWEATHER_API_KEY=...
  - EXPO_PUBLIC_OPENAI_API_KEY=... (or Grok token)
  - Firebase web config keys
- npm install
- npm run start

## Run
- npm run android
- npm run ios
- npm run web

## Notes
- No secrets committed. Env via Expo public runtime vars.
- Mapbox, OpenWeather, OpenAI/Grok, Firebase required.
