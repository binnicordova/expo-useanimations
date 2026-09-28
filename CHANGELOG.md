# Changelog

## 0.1.0 — 2026-09-28

Initial release.

- `UseAnimations` component for iOS, Android and web (Expo SDK 58+).
- All 79 useAnimations icons, importable one by one (`expo-useanimations/lib/<name>`) or all at once (`expo-useanimations/all`).
- Works in Expo Go and with EAS Update: zero native code (native uses `lottie-react-native`, web uses `lottie-web`).
- Cross-platform `strokeColor` / `fillColor` recolouring done in JS.
- Interaction presets matching react-useanimations, with touch-friendly equivalents for hover effects.
- Controlled `reverse`, render prop, and imperative `ref` API (`play`, `playBackwards`, `toggle`, `reset`, `stop`).
