import type { ReactElement, ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import type { AnimationKey } from './keys';

/**
 * How an animation reacts to the user. Mirrors react-useanimations so every icon
 * behaves the same way it does on the web version.
 *
 * On touch devices, "hover" effects are mapped to press-in / press-out.
 */
export type AnimationEffect =
  | 'CLICK_PLAY_AND_BACKWARDS'
  | 'HOVER_PLAY_AND_STOP'
  | 'HOVER_PLAY_AND_BACKWARDS'
  | 'CLICK_PLAY'
  | 'LOOP_PLAY'
  | 'CLICK_PLAY_AND_SEGMENTS';

/** Raw Lottie (Bodymovin) JSON. Kept loose on purpose so custom files can be passed. */
export type LottieJSON = {
  v?: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  layers: unknown[];
  assets?: unknown[];
  [key: string]: unknown;
};

/** One animation, as exported by `expo-useanimations/lib/<name>`. */
export type Animation = {
  animationKey: AnimationKey | (string & {});
  animationData: LottieJSON | Record<string, unknown>;
  /** Interaction preset. Defaults to `CLICK_PLAY` for custom animations. */
  effect?: AnimationEffect;
};

/** Imperative API exposed through `ref`. */
export type UseAnimationsHandle = {
  /** Play from the first to the last frame. */
  play: () => void;
  /** Play from the last to the first frame. */
  playBackwards: () => void;
  /** Toggle between the "start" and "end" states (checkbox-like icons). */
  toggle: () => void;
  /** Stop and go back to the first frame. */
  reset: () => void;
  /** Stop (native: reset) and hold the current frame where supported (web). */
  stop: () => void;
};

/** Props of the underlying player, shared by the native and web implementations. */
export type PlayerProps = {
  animationData: Record<string, unknown>;
  size: number;
  loop: boolean;
  autoplay: boolean;
  speed: number;
  /** Web only: extra CSS appended to every `<path>` of this animation. */
  pathCss?: string;
  /** Escape hatch forwarded to lottie-react-native (native) or lottie-web's config (web). */
  options?: Record<string, unknown>;
  style?: StyleProp<ViewStyle>;
  onAnimationFinish?: (isCancelled: boolean) => void;
};

export type PlayerHandle = {
  playSegment: (from: number, to: number) => void;
  reset: () => void;
  stop: () => void;
};

export type EventProps = Pick<
  PressableProps,
  'onPress' | 'onPressIn' | 'onPressOut' | 'onHoverIn' | 'onHoverOut'
>;

export type UseAnimationsProps = {
  /** Animation object, e.g. `import heart from 'expo-useanimations/lib/heart'`. */
  animation: Animation;
  /** Width & height in dp/px. @default 24 */
  size?: number;
  /** Replaces every stroke colour of the animation. Any React Native colour string. */
  strokeColor?: string;
  /** Replaces every fill colour of the animation. Any React Native colour string. */
  fillColor?: string;
  /** Web only: raw CSS string applied to the animation `<path>` elements. */
  pathCss?: string;
  /**
   * Start in the "end" state (e.g. a checked checkbox). For toggle-like icons
   * (`CLICK_PLAY_AND_BACKWARDS`) the animation plays forward once on mount.
   * @default false
   */
  reverse?: boolean;
  /** Overrides the preset. `true` for looping icons (loading…), otherwise `false`. */
  autoplay?: boolean;
  /** Overrides the preset. `true` for looping icons (loading…), otherwise `false`. */
  loop?: boolean;
  /** Playback speed multiplier. @default 1 */
  speed?: number;
  /** Override the interaction preset of the animation. */
  effect?: AnimationEffect;
  /** Style of the wrapping Pressable. */
  wrapperStyle?: StyleProp<ViewStyle>;
  /** Alias of `wrapperStyle`. */
  style?: StyleProp<ViewStyle>;
  /** Extra props for the player: lottie-react-native props (native) / lottie-web config (web). */
  options?: Record<string, unknown>;
  /** Called after the built-in interaction runs. */
  onPress?: PressableProps['onPress'];
  /** Alias of `onPress` for parity with react-useanimations. */
  onClick?: PressableProps['onPress'];
  /** Disables the built-in interactions (the animation can still be driven via `ref`). */
  disabled?: boolean;
  /**
   * Render prop to wrap the animation yourself, e.g. inside a button.
   * Spread `eventProps` on your Pressable and render `animation` inside it.
   */
  render?: (eventProps: EventProps, animation: ReactNode) => ReactElement;
  testID?: string;
  accessibilityLabel?: string;
};
