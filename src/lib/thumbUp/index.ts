import source from 'react-useanimations/lib/thumbUp';

import type { Animation } from '../../types';

/** useAnimations "thumbUp" icon (© useanimations.com, CC BY 4.0). */
const thumbUp: Animation = {
  animationKey: 'thumbUp',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default thumbUp;
