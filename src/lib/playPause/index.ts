import source from 'react-useanimations/lib/playPause';

import type { Animation } from '../../types';

/** useAnimations "playPause" icon (© useanimations.com, CC BY 4.0). */
const playPause: Animation = {
  animationKey: 'playPause',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default playPause;
