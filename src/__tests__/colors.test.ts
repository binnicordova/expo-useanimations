import heart from '../lib/heart';
import { recolor, toLottieColor } from '../utils/colors';

function collect(node: any, ty: string, out: number[][] = []): number[][] {
  if (Array.isArray(node)) node.forEach((n) => collect(n, ty, out));
  else if (node && typeof node === 'object') {
    if (node.ty === ty && node.c?.a === 0) out.push(node.c.k);
    Object.values(node).forEach((v) => collect(v, ty, out));
  }
  return out;
}

describe('toLottieColor', () => {
  it('parses hex, rgb and named colours', () => {
    expect(toLottieColor('#ff0000')).toEqual([1, 0, 0, 1]);
    expect(toLottieColor('#0f08')).toEqual([0, 1, 0, 0x88 / 255]);
    expect(toLottieColor('rgb(0, 0, 255)')).toEqual([0, 0, 1, 1]);
    expect(toLottieColor('white')).toEqual([1, 1, 1, 1]);
    expect(toLottieColor('not-a-colour')).toBeNull();
  });
});

describe('recolor', () => {
  const data = heart.animationData as Record<string, unknown>;

  it('returns the same object when no colour is given', () => {
    expect(recolor(data)).toBe(data);
  });

  it('replaces every stroke without mutating the source', () => {
    const before = JSON.stringify(data);
    const out = recolor(data, '#ff0000');
    expect(JSON.stringify(data)).toBe(before);
    const strokes = collect(out.layers, 'st');
    expect(strokes.length).toBeGreaterThan(0);
    strokes.forEach((c) => expect(c).toEqual([1, 0, 0, 1]));
  });

  it('caches per colour pair', () => {
    expect(recolor(data, 'red')).toBe(recolor(data, 'red'));
    expect(recolor(data, 'red')).not.toBe(recolor(data, 'blue'));
  });
});
