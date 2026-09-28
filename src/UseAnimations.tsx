import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ForwardedRef,
} from 'react';
import { Platform, Pressable, type GestureResponderEvent } from 'react-native';

import LottiePlayer from './player/LottiePlayer';
import type {
  AnimationEffect,
  EventProps,
  PlayerHandle,
  UseAnimationsHandle,
  UseAnimationsProps,
} from './types';
import { recolor } from './utils/colors';

const IS_WEB = Platform.OS === 'web';
/** Frames played by `CLICK_PLAY_AND_SEGMENTS` icons (skipForward / skipBack), same as react-useanimations. */
const SEGMENT: [number, number] = [0, 60];

function UseAnimationsImpl(
  {
    animation,
    size = 24,
    strokeColor,
    fillColor,
    pathCss,
    reverse = false,
    autoplay,
    loop,
    speed = 1,
    effect: effectOverride,
    wrapperStyle,
    style,
    options,
    onPress,
    onClick,
    disabled = false,
    render,
    testID,
    accessibilityLabel,
  }: UseAnimationsProps,
  ref: ForwardedRef<UseAnimationsHandle>
) {
  const effect: AnimationEffect = effectOverride ?? animation.effect ?? 'CLICK_PLAY';
  const isLoop = effect === 'LOOP_PLAY';

  const data = useMemo(
    () => recolor(animation.animationData as Record<string, unknown>, strokeColor, fillColor),
    [animation.animationData, strokeColor, fillColor]
  );
  const first = typeof data.ip === 'number' ? data.ip : 0;
  const last = typeof data.op === 'number' ? data.op : 0;

  const player = useRef<PlayerHandle>(null);
  /** Whether the animation currently rests on its last frame (toggle icons). */
  const atEnd = useRef(false);
  /** Forward play still running when the finger/pointer left: go back once it finishes. */
  const playingForward = useRef(false);
  const pendingBackwards = useRef(false);

  const playForward = useCallback(() => {
    pendingBackwards.current = false;
    playingForward.current = true;
    atEnd.current = true;
    player.current?.playSegment(first, last);
  }, [first, last]);

  const playBackwards = useCallback(() => {
    pendingBackwards.current = false;
    playingForward.current = false;
    atEnd.current = false;
    player.current?.playSegment(last, first);
  }, [first, last]);

  const toggle = useCallback(() => {
    if (atEnd.current) playBackwards();
    else playForward();
  }, [playBackwards, playForward]);

  const reset = useCallback(() => {
    pendingBackwards.current = false;
    playingForward.current = false;
    atEnd.current = false;
    player.current?.reset();
  }, []);

  useImperativeHandle(
    ref,
    () => ({ play: playForward, playBackwards, toggle, reset, stop: () => player.current?.stop() }),
    [playForward, playBackwards, toggle, reset]
  );

  // `reverse` = "should rest on the end state". Works both as an initial value and as a
  // controlled prop: it only animates when the visual state and the prop disagree.
  useEffect(() => {
    if (effect !== 'CLICK_PLAY_AND_BACKWARDS') return;
    if (reverse && !atEnd.current) playForward();
    else if (!reverse && atEnd.current) playBackwards();
  }, [reverse, effect, playForward, playBackwards]);

  const onAnimationFinish = useCallback(
    (isCancelled: boolean) => {
      if (isCancelled) return;
      playingForward.current = false;
      if (pendingBackwards.current) playBackwards();
    },
    [playBackwards]
  );

  const backwardsWhenDone = useCallback(() => {
    if (playingForward.current) pendingBackwards.current = true;
    else playBackwards();
  }, [playBackwards]);

  const playSegments = useCallback(() => {
    player.current?.playSegment(SEGMENT[0], Math.min(SEGMENT[1], last));
  }, [last]);

  /** Built-in reaction to a tap/click for the current effect. */
  const runPress = useCallback(() => {
    switch (effect) {
      case 'CLICK_PLAY_AND_BACKWARDS':
        return toggle();
      case 'CLICK_PLAY_AND_SEGMENTS':
        return playSegments();
      case 'HOVER_PLAY_AND_BACKWARDS':
        return undefined; // handled by press-in / press-out or hover
      case 'HOVER_PLAY_AND_STOP':
        // Touch devices have no hover: play once per tap.
        return IS_WEB ? undefined : playForward();
      default:
        return playForward();
    }
  }, [effect, toggle, playSegments, playForward]);

  const userPress = onPress ?? onClick;
  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (!disabled) runPress();
      userPress?.(e);
    },
    [disabled, runPress, userPress]
  );

  const eventProps = useMemo<EventProps>(() => {
    if (!disabled && effect === 'HOVER_PLAY_AND_STOP' && IS_WEB) {
      return { onPress: handlePress, onHoverIn: playForward, onHoverOut: reset };
    }
    if (!disabled && effect === 'HOVER_PLAY_AND_BACKWARDS') {
      return IS_WEB
        ? { onPress: handlePress, onHoverIn: playForward, onHoverOut: backwardsWhenDone }
        : // Touch: press-in plays forward, release plays it back.
          { onPress: handlePress, onPressIn: playForward, onPressOut: backwardsWhenDone };
    }
    return { onPress: handlePress };
  }, [effect, disabled, handlePress, playForward, reset, backwardsWhenDone]);

  const playerElement = (
    <LottiePlayer
      ref={player}
      animationData={data}
      size={size}
      loop={loop ?? isLoop}
      autoplay={autoplay ?? isLoop}
      speed={speed}
      pathCss={pathCss}
      options={options}
      onAnimationFinish={onAnimationFinish}
    />
  );

  // `playerElement` only carries the ref object; nothing reads `.current` during render.
  // eslint-disable-next-line react-hooks/refs
  if (render) return render(eventProps, playerElement);

  const interactive = !disabled && (effect !== 'LOOP_PLAY' || !!userPress);

  return (
    <Pressable
      {...eventProps}
      disabled={!interactive}
      testID={testID}
      accessibilityRole={interactive ? 'button' : 'image'}
      accessibilityLabel={accessibilityLabel ?? String(animation.animationKey)}
      style={[{ width: size, height: size, overflow: 'hidden' }, wrapperStyle, style]}>
      {playerElement}
    </Pressable>
  );
}

/**
 * Animated micro-interaction icon.
 *
 * ```tsx
 * import UseAnimations from 'expo-useanimations';
 * import heart from 'expo-useanimations/lib/heart';
 *
 * <UseAnimations animation={heart} size={48} strokeColor="#e11d48" />
 * ```
 */
const UseAnimations = forwardRef(UseAnimationsImpl);
UseAnimations.displayName = 'UseAnimations';

export default UseAnimations;
