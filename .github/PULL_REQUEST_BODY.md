# CitySidekick MVP

This PR delivers the MVP of CitySidekick (Expo React Native):
- Onboarding with preferences + location (manual city fallback)
- Interactive Mapbox map (native iOS/Android), web fallback; style toggle (Tranquil/Urban)
- POIs from OpenStreetMap (Overpass), cached (30m)
- Weather-aware advice + outfits via EchoGuide (AI), includes Eco-Insight
- Chat with TTS and Google STT mic; chat history persisted in Firebase
- Freemium daily AI limit (default 10/day) enforced client-side
- Offline caching for weather (15m) and POIs
- AR placeholder screen in Expo Go; README includes Dev Client steps for Vision Camera

Setup
- Copy .env.example to .env and fill EXPO_PUBLIC_* keys (Mapbox, OpenWeather, OpenAI, Firebase, Google STT)
- npm install
- npx expo start

Notes
- Secrets not committed; only .env.example updated
- TypeScript config fixed for Expo ("moduleResolution": "bundler")

Screenshots
- Add if desired

Link to Devin run
https://app.devin.ai/sessions/6a8f94a537ee43c4978b2793c7c6fad9

Requested by
Levan Makhatadze (@levanmakhatadze)

Assisted by
Devin AI
