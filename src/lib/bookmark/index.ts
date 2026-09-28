import source from 'react-useanimations/lib/bookmark';

import type { Animation } from '../../types';

/** useAnimations "bookmark" icon (© useanimations.com, CC BY 4.0). */
const bookmark: Animation = {
  animationKey: 'bookmark',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default bookmark;
