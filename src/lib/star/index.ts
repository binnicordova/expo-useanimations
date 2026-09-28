import source from 'react-useanimations/lib/star';

import type { Animation } from '../../types';

/** useAnimations "star" icon (© useanimations.com, CC BY 4.0). */
const star: Animation = {
  animationKey: 'star',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default star;
