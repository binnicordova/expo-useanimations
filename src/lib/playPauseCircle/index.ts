import source from 'react-useanimations/lib/playPauseCircle';

import type { Animation } from '../../types';

/** useAnimations "playPauseCircle" icon (© useanimations.com, CC BY 4.0). */
const playPauseCircle: Animation = {
  animationKey: 'playPauseCircle',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default playPauseCircle;
