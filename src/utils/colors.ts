import normalizeColor from '@react-native/normalize-colors';

type RGBA = [number, number, number, number];

/** Converts any React Native / CSS colour string to Lottie's normalized `[r, g, b, a]`. */
export function toLottieColor(color: string): RGBA | null {
  const int = normalizeColor(color);
  if (int == null || typeof int !== 'number') return null;
  // normalize-colors returns 0xRRGGBBAA
  const r = ((int >>> 24) & 0xff) / 255;
  const g = ((int >>> 16) & 0xff) / 255;
  const b = ((int >>> 8) & 0xff) / 255;
  const a = (int & 0xff) / 255;
  return [r, g, b, a];
}

function paint(node: unknown, stroke: RGBA | null, fill: RGBA | null): void {
  if (Array.isArray(node)) {
    for (const child of node) paint(child, stroke, fill);
    return;
  }
  if (!node || typeof node !== 'object') return;

  const obj = node as Record<string, any>;
  const target = obj.ty === 'st' ? stroke : obj.ty === 'fl' ? fill : null;
  if (target && obj.c && typeof obj.c === 'object') {
    if (obj.c.a === 1 && Array.isArray(obj.c.k)) {
      // Animated colour: repaint every keyframe.
      for (const kf of obj.c.k) {
        if (kf && Array.isArray(kf.s)) kf.s = [...target];
        if (kf && Array.isArray(kf.e)) kf.e = [...target];
      }
    } else {
      obj.c.k = [...target];
    }
    // Lottie multiplies by the shape's opacity; keep alpha from the colour string.
    if (target[3] < 1 && obj.o && obj.o.a === 0 && typeof obj.o.k === 'number') {
      obj.o.k = obj.o.k * target[3];
    }
  }

  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === 'object') paint(value, stroke, fill);
  }
}

const cache = new WeakMap<object, Map<string, Record<string, unknown>>>();

/**
 * Returns a copy of `data` with every stroke and/or fill replaced.
 * Pure JS, so it works identically on iOS, Android and web (and in Expo Go).
 * Results are cached per animation + colour pair.
 */
export function recolor<T extends Record<string, unknown>>(
  data: T,
  strokeColor?: string,
  fillColor?: string
): T {
  if (!strokeColor && !fillColor) return data;

  const key = `${strokeColor ?? ''}|${fillColor ?? ''}`;
  let byColor = cache.get(data);
  const hit = byColor?.get(key);
  if (hit) return hit as T;

  const stroke = strokeColor ? toLottieColor(strokeColor) : null;
  const fill = fillColor ? toLottieColor(fillColor) : null;
  if (!stroke && !fill) return data;

  const copy = JSON.parse(JSON.stringify(data)) as T;
  paint(copy.layers, stroke, fill);
  paint(copy.assets, stroke, fill);

  if (!byColor) {
    byColor = new Map();
    cache.set(data, byColor);
  }
  byColor.set(key, copy);
  return copy;
}
