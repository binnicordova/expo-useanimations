import animations from '../all';
import { animationKeys } from '../keys';

describe('catalog', () => {
  it('exposes all 79 animations with an effect and valid Lottie data', () => {
    expect(animationKeys).toHaveLength(79);
    for (const key of animationKeys) {
      const a = animations[key];
      expect(a.animationKey).toBe(key);
      expect(a.effect).toBeTruthy();
      const d = a.animationData as any;
      expect(typeof d.op).toBe('number');
      expect(Array.isArray(d.layers)).toBe(true);
    }
  });
});
