import source from 'react-useanimations/lib/lock';

import type { Animation } from '../../types';

/** useAnimations "lock" icon (© useanimations.com, CC BY 4.0). */
const lock: Animation = {
  animationKey: 'lock',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default lock;
