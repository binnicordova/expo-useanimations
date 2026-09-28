import source from 'react-useanimations/lib/heart';

import type { Animation } from '../../types';

/** useAnimations "heart" icon (© useanimations.com, CC BY 4.0). */
const heart: Animation = {
  animationKey: 'heart',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default heart;
