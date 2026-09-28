import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';

import type { PlayerHandle, PlayerProps } from '../types';

type AnimationItem = import('lottie-web').AnimationItem;

const SHEET_ID = 'expo-useanimations-sheet';

function upsertPathCss(svgId: string, css: string | undefined): () => void {
  if (!css || typeof document === 'undefined') return () => {};
  let el = document.getElementById(SHEET_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = SHEET_ID;
    document.head.appendChild(el);
  }
  const sheet = el.sheet!;
  const selector = `#${svgId} path`;
  sheet.insertRule(`${selector} { ${css} }`, sheet.cssRules.length);
  return () => {
    const i = Array.from(sheet.cssRules).findIndex(
      (r) => (r as CSSStyleRule).selectorText === selector
    );
    if (i !== -1) sheet.deleteRule(i);
  };
}

/**
 * Web player. Uses `lottie-web` (pure JS, the same engine react-useanimations uses)
 * rendering to SVG inside a react-native-web `View`.
 */
const LottiePlayer = forwardRef<PlayerHandle, PlayerProps>(function LottiePlayer(
  { animationData, size, loop, autoplay, speed, pathCss, options, style, onAnimationFinish },
  ref
) {
  const container = useRef<any>(null);
  const anim = useRef<AnimationItem | null>(null);
  const finishRef = useRef(onAnimationFinish);
  finishRef.current = onAnimationFinish;
  // Read options through a ref so an inline object doesn't rebuild the animation every render.
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const svgId = `ua_${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  useEffect(() => {
    const node = container.current as unknown as HTMLElement | null;
    if (!node) return;
    // Lazy require keeps lottie-web (which touches `document`) out of SSR / static rendering.
    const lottie: typeof import('lottie-web').default =
      require('lottie-web').default ?? require('lottie-web');
    const item = lottie.loadAnimation({
      container: node,
      renderer: 'svg',
      animationData,
      loop,
      autoplay,
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: 'xMidYMid meet',
        // @ts-expect-error `id` is supported by lottie-web but missing from its types
        id: svgId,
      },
      ...optionsRef.current,
    });
    item.setSpeed(speed);
    const onComplete = () => finishRef.current?.(false);
    item.addEventListener('complete', onComplete);
    anim.current = item;
    return () => {
      item.removeEventListener('complete', onComplete);
      item.destroy();
      anim.current = null;
    };
    // `speed` is handled below without rebuilding the animation.
  }, [animationData, loop, autoplay, svgId]);

  useEffect(() => {
    anim.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => upsertPathCss(svgId, pathCss), [svgId, pathCss]);

  useImperativeHandle(
    ref,
    () => ({
      playSegment: (from, to) => anim.current?.playSegments([from, to], true),
      reset: () => anim.current?.goToAndStop(0, true),
      stop: () => anim.current?.stop(),
    }),
    []
  );

  return (
    <View ref={container} style={[{ width: size, height: size, overflow: 'hidden' }, style]} />
  );
});

export default LottiePlayer;
