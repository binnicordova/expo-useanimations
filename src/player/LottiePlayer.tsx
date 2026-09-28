import LottieView from 'lottie-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { PlayerHandle, PlayerProps } from '../types';

/**
 * iOS / Android player.
 *
 * Uses `lottie-react-native`, which ships inside Expo Go and every Expo SDK,
 * so this package itself contains zero native code and is fully OTA-updatable.
 */
const LottiePlayer = forwardRef<PlayerHandle, PlayerProps>(function LottiePlayer(
  { animationData, size, loop, autoplay, speed, options, style, onAnimationFinish },
  ref
) {
  const lottie = useRef<LottieView>(null);

  useImperativeHandle(
    ref,
    () => ({
      // lottie-react-native plays in reverse when `from > to` on both platforms.
      playSegment: (from, to) => lottie.current?.play(from, to),
      reset: () => lottie.current?.reset(),
      stop: () => lottie.current?.reset(),
    }),
    []
  );

  return (
    <LottieView
      ref={lottie}
      source={animationData as any}
      autoPlay={autoplay}
      loop={loop}
      speed={speed}
      resizeMode="contain"
      onAnimationFinish={onAnimationFinish}
      style={[{ width: size, height: size }, style]}
      {...options}
    />
  );
});

export default LottiePlayer;
