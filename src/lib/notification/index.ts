import source from 'react-useanimations/lib/notification';

import type { Animation } from '../../types';

/** useAnimations "notification" icon (© useanimations.com, CC BY 4.0). */
const notification: Animation = {
  animationKey: 'notification',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default notification;
