import source from 'react-useanimations/lib/checkmark';

import type { Animation } from '../../types';

/** useAnimations "checkmark" icon (© useanimations.com, CC BY 4.0). */
const checkmark: Animation = {
  animationKey: 'checkmark',
  animationData: source.animationData,
  effect: 'LOOP_PLAY',
};

export default checkmark;
