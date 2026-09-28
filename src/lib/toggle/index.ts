import source from 'react-useanimations/lib/toggle';

import type { Animation } from '../../types';

/** useAnimations "toggle" icon (© useanimations.com, CC BY 4.0). */
const toggle: Animation = {
  animationKey: 'toggle',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default toggle;
