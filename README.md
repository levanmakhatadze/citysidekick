# CitySidekick (Expo + React Native)

Personalized, serene city exploration with an AI companion (EchoGuide), Mapbox map + POIs, weather-aware outfit tips, voice chat, offline caching, and a freemium daily AI limit.

## Prerequisites
- Node 18 (run `nvm use 18`)
- Expo (CLI optional): `npm i -g expo-cli` (or use `npx expo`)
- Android Studio / Xcode (emulators) or a device with Expo Go

## 1) Setup
1. Clone
   - `git clone https://github.com/levanmakhatadze/citysidekick.git`
   - `cd citysidekick`
2. Env
   - `cp .env.example .env`
   - Fill the EXPO_PUBLIC_* keys:
     - `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`
     - `EXPO_PUBLIC_OPENWEATHER_API_KEY`
     - `EXPO_PUBLIC_OPENAI_API_KEY` (or Grok if you swap providers in src/services/ai.ts)
     - Firebase web config: `EXPO_PUBLIC_FIREBASE_*`
     - STT: `EXPO_PUBLIC_STT_PROVIDER=google` and `EXPO_PUBLIC_GOOGLE_STT_API_KEY`
     - Optional: `EXPO_PUBLIC_FREE_DAILY_AI_LIMIT=10`
3. Install
   - `npm install`

## 2) Run (MVP)
- Start Metro: `npx expo start`
- Web (fallback map): press `w`
- Android: press `a` (emulator running) or scan QR with Expo Go
- iOS: press `i` (simulator) or scan QR with Expo Go

Notes:
- Native Mapbox and voice recording run on iOS/Android. Web shows a fallback notice for the map.
- First launch asks for location; you can also search for a city manually.

## 3) Features to try
- Onboarding: tone preferences and location permission; manual city fallback
- Map: center on location, search city, switch style (Tranquil/Urban), see POIs (cafes, parks, attractions)
- Advice Sheet: pulls weather and gets succinct EchoGuide advice (Destination, Outfit, Eco-Insight) + Share Plan
- Chat: TTS replies; Mic for Google STT; daily AI limit gating (default 10/day)
- Offline: caches POIs (30m) and weather (15m)
- Firebase: anonymous auth, saved prefs, chat history

## 4) AR (Dev Client only for MVP)
Expo Go cannot load native Vision Camera. This MVP includes an AR placeholder screen.
- To enable camera-based AR preview, build a Dev Client (or EAS build):
  1. `npx expo prebuild` (or use EAS workflow)
  2. Configure Vision Camera per its docs and ensure camera/microphone permissions
  3. Run the Dev Client and open the app; the AR screen will show the camera preview with simple overlays
- In Expo Go, the AR screen shows a placeholder message.

## 5) Privacy, security, and limits
- No secrets are committed; all keys read from `.env`
- Location used locally to fetch nearby POIs and weather
- Freemium: daily AI limit enforced before calling the AI provider
- Consider scoping API keys and proxying STT/AI in production

## Troubleshooting
- If Mapbox native plugin causes build issues, keep `EXPO_USE_MAPBOX_PLUGIN` unset to run with Expo Go and the web fallback
- TypeScript config uses `"moduleResolution": "bundler"` for Expo

## Scripts
- `npm run start` → start Metro
- `npm run android` / `npm run ios` / `npm run web`
