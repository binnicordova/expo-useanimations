import source from 'react-useanimations/lib/microphone';

import type { Animation } from '../../types';

/** useAnimations "microphone" icon (© useanimations.com, CC BY 4.0). */
const microphone: Animation = {
  animationKey: 'microphone',
  animationData: source.animationData,
  effect: 'CLICK_PLAY_AND_BACKWARDS',
};

export default microphone;
