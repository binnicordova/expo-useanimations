# expo-useanimations

**79 animated micro-interaction icons for Expo & React Native — iOS, Android and web.**

A TypeScript port of [react-useanimations](https://github.com/useAnimations/react-useanimations) built for the Expo ecosystem:

- ✅ **Works in Expo Go** — no development build, no `prebuild`, no config plugin.
- ✅ **EAS Update / `expo-updates` friendly** — the package is 100% JavaScript, so icons, colours and behaviour ship over the air.
- ✅ **Zero native code** — iOS/Android render with [`lottie-react-native`](https://github.com/lottie-react-native/lottie-react-native) (bundled in every Expo SDK and in Expo Go); web renders with [`lottie-web`](https://github.com/airbnb/lottie-web) as SVG.
- ✅ **Tree-shakeable** — import only the icons you use.
- ✅ **Typed** — full TypeScript types, autocompletion for all 79 icon names.
- ✅ **Recolourable everywhere** — `strokeColor` / `fillColor` accept any React Native colour and are applied in JS, identically on every platform.

> Requires **Expo SDK 58+** (`expo@>=58`), React Native 0.88+.

---

## Installation

```sh
npx expo install expo-useanimations lottie-react-native
```

Using bun:

```sh
bunx expo install expo-useanimations lottie-react-native
```

`npx expo install` picks the `lottie-react-native` version that matches your SDK, which is the one already compiled into Expo Go. Nothing else to configure.

---

## Quick start

```tsx
import UseAnimations from 'expo-useanimations';
// Every icon is its own import: your bundle only contains what you use.
import github from 'expo-useanimations/lib/github';

export default function Screen() {
  return <UseAnimations animation={github} size={56} />;
}
```

### Colours & dark mode

```tsx
import { useColorScheme } from 'react-native';
import heart from 'expo-useanimations/lib/heart';

const scheme = useColorScheme();

<UseAnimations
  animation={heart}
  size={40}
  strokeColor={scheme === 'dark' ? '#f4f4f5' : '#18181b'}
  fillColor="#e11d48"
/>;
```

### Controlled toggle (checkbox, menu, play/pause…)

`reverse` is the "end state" of toggle icons. It works as an initial value **and** as a controlled prop — the icon only animates when its visual state and the prop disagree.

```tsx
import checkBox from 'expo-useanimations/lib/checkBox';

const [checked, setChecked] = useState(false);

<UseAnimations
  animation={checkBox}
  size={32}
  reverse={checked}
  onPress={() => setChecked((v) => !v)}
/>;
```

### Wrap it in your own button (render prop)

```tsx
import { Pressable, Text } from 'react-native';
import heart from 'expo-useanimations/lib/heart';

<UseAnimations
  animation={heart}
  size={24}
  onPress={() => like()}
  render={(eventProps, animation) => (
    <Pressable {...eventProps} style={styles.button}>
      {animation}
      <Text>Like</Text>
    </Pressable>
  )}
/>;
```

Spread `eventProps` (`onPress`, `onPressIn`/`onPressOut`, `onHoverIn`/`onHoverOut`) on your own `Pressable` and render `animation` inside it.

### Drive it imperatively

```tsx
import UseAnimations, { type UseAnimationsHandle } from 'expo-useanimations';
import playPause from 'expo-useanimations/lib/playPause';

const ref = useRef<UseAnimationsHandle>(null);

<UseAnimations ref={ref} animation={playPause} disabled />;

ref.current?.play();          // first → last frame
ref.current?.playBackwards(); // last → first frame
ref.current?.toggle();        // flip between start / end state
ref.current?.reset();         // back to frame 0
```

### Every icon at once (showcases, pickers)

```tsx
import UseAnimations, { animationKeys } from 'expo-useanimations';
import animations from 'expo-useanimations/all'; // ⚠️ bundles all 79 icons

animationKeys.map((key) => <UseAnimations key={key} animation={animations[key]} />);
```

---

## Props

| Prop                 | Type                                     | Default          | Description                                                                                         |
| :------------------- | :--------------------------------------- | :--------------- | :-------------------------------------------------------------------------------------------------- |
| `animation`          | `Animation`                              | —                | **Required.** An icon from `expo-useanimations/lib/<name>` (or your own Lottie JSON, see below).    |
| `size`               | `number`                                 | `24`             | Width and height.                                                                                   |
| `strokeColor`        | `string`                                 | original         | Replaces every stroke colour. Any RN colour (`'#fff'`, `'rgb(…)'`, `'tomato'`…).                    |
| `fillColor`          | `string`                                 | original         | Replaces every fill colour.                                                                         |
| `reverse`            | `boolean`                                | `false`          | End state for toggle icons (checked, open, playing…). Initial or controlled.                        |
| `autoplay`           | `boolean`                                | preset           | `true` for looping icons (`loading`, `activity`…), otherwise `false`.                               |
| `loop`               | `boolean`                                | preset           | Same as above.                                                                                      |
| `speed`              | `number`                                 | `1`              | Playback speed multiplier.                                                                          |
| `effect`             | `AnimationEffect`                        | icon preset      | Override how the icon reacts (see below).                                                           |
| `onPress`            | `(e) => void`                            | —                | Called after the built-in interaction. `onClick` is accepted as an alias.                           |
| `disabled`           | `boolean`                                | `false`          | Disables built-in interactions (the `ref` API still works).                                         |
| `wrapperStyle`/`style` | `StyleProp<ViewStyle>`                 | —                | Style of the wrapping `Pressable`.                                                                  |
| `render`             | `(eventProps, animation) => ReactElement` | —               | Render prop to provide your own wrapper.                                                            |
| `options`            | `object`                                 | —                | Escape hatch: extra `LottieView` props on native, extra `lottie-web` config on web.                 |
| `pathCss`            | `string`                                 | —                | **Web only.** Raw CSS applied to the icon's `<path>` elements.                                      |
| `testID`, `accessibilityLabel` | `string`                       | icon name        | Testing & accessibility.                                                                            |

### Interaction presets

Each icon ships with the same behaviour as on [useanimations.com](https://useanimations.com):

| Effect                     | Web (mouse)                          | iOS / Android (touch)                       | Example icons                    |
| :------------------------- | :----------------------------------- | :------------------------------------------ | :------------------------------- |
| `CLICK_PLAY_AND_BACKWARDS` | click toggles forward / backward     | tap toggles forward / backward              | `checkBox`, `menu`, `heart`      |
| `CLICK_PLAY`               | click plays once                     | tap plays once                              | `copy`, `download`, `mail`       |
| `CLICK_PLAY_AND_SEGMENTS`  | click plays frames 0–60              | tap plays frames 0–60                       | `skipForward`, `skipBack`        |
| `HOVER_PLAY_AND_STOP`      | hover plays, leave resets            | tap plays once                              | `github`, `twitter`, `home`      |
| `HOVER_PLAY_AND_BACKWARDS` | hover plays, leave plays back        | press-in plays, release plays back          | `settings`, `trash`, `archive`   |
| `LOOP_PLAY`                | autoplays in a loop                  | autoplays in a loop                         | `loading`, `activity`, `infinity`|

---

## Available icons

`activity` · `airplay` · `alertCircle` · `alertOctagon` · `alertTriangle` · `archive` · `arrowDown` · `arrowDownCircle` · `arrowLeftCircle` · `arrowRightCircle` · `arrowUp` · `arrowUpCircle` · `behance` · `bookmark` · `calendar` · `checkBox` · `checkmark` · `codepen` · `copy` · `download` · `dribbble` · `edit` · `error` · `explore` · `facebook` · `folder` · `github` · `heart` · `help` · `home` · `infinity` · `info` · `instagram` · `linkedin` · `loading` · `loading2` · `loading3` · `lock` · `mail` · `maximizeMinimize` · `maximizeMinimize2` · `menu` · `menu2` · `menu3` · `menu4` · `microphone` · `microphone2` · `notification` · `notification2` · `playPause` · `playPauseCircle` · `plusToX` · `pocket` · `radioButton` · `scrollDown` · `searchToX` · `settings` · `settings2` · `share` · `skipBack` · `skipForward` · `star` · `thumbUp` · `toggle` · `trash` · `trash2` · `twitter` · `userMinus` · `userPlus` · `userX` · `video` · `video2` · `visibility` · `visibility2` · `volume` · `youtube` · `youtube2` · `zoomIn` · `zoomOut`

Browse them live at [useanimations.com](https://useanimations.com) or run the example app (below).

### Using your own Lottie file

Any Lottie JSON works:

```tsx
import type { Animation } from 'expo-useanimations';
import rocketJson from './rocket.json';

const rocket: Animation = { animationKey: 'rocket', animationData: rocketJson, effect: 'CLICK_PLAY' };

<UseAnimations animation={rocket} size={64} />;
```

---

## Why it works in Expo Go and with EAS Update

| Piece                       | Where it runs | Native code?                                                    |
| :-------------------------- | :------------ | :-------------------------------------------------------------- |
| `expo-useanimations`        | all           | **None** — TypeScript only.                                     |
| Icon data                   | all           | Plain JSON, bundled into your JS bundle.                        |
| Colouring (`strokeColor`…)  | all           | Rewrites the Lottie JSON in JS before rendering.                |
| `lottie-react-native`       | iOS / Android | Yes, but it is **already inside Expo Go** and every Expo SDK.   |
| `lottie-web`                | web           | Pure JS (loaded lazily, SSR-safe).                              |

Because nothing new has to be compiled into the app binary, adding or updating this package — or changing icons, colours and sizes — can be shipped with `eas update` to apps already in the stores.

---

## Example app

The `example/` folder is a plain Expo SDK 58 app (no `ios/` or `android/` folders) that runs in **Expo Go** and consumes the library straight from `src/`, with hot reload.

```sh
git clone https://github.com/binnicordova/expo-useanimations.git
cd expo-useanimations
bun install
cd example
bun install
bun run ios       # iOS Simulator, Expo Go
bun run android   # emulator or USB device, Expo Go
bun run web       # browser
```

---

## Development

```sh
bun install
bun run typecheck   # tsc --noEmit
bun run lint        # eslint
bun run test        # jest (jest-expo)
bun run build       # emits build/ (JS + .d.ts)
```

The icon entry points in `src/lib/*` are generated from the official `react-useanimations` package:

```sh
# after upstream publishes new icons
bun add react-useanimations@latest
# add "<iconName>": "<EFFECT>" to scripts/effects.json
bun run generate
```

### Publishing

```sh
bun run prepublishOnly   # typecheck + tests + clean build
npm publish --dry-run    # inspect the tarball
npm publish
```

---

## Credits & license

- Animations are designed by **[useAnimations](https://useanimations.com)** (Tuan Phung & Marek Feikus) and are consumed from the official [`react-useanimations`](https://www.npmjs.com/package/react-useanimations) package — this package does **not** copy or redistribute the animation files. The artwork is licensed by useAnimations under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)** with their own terms; **you must credit / link to [useanimations.com](https://useanimations.com)** in apps that use it. See [the upstream license](https://github.com/useAnimations/react-useanimations/blob/master/LICENSE).
- The `expo-useanimations` source code (component, players, colouring, types, tooling) is **MIT** © Binni Cordova — see [LICENSE](./LICENSE).
