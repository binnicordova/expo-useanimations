import source from 'react-useanimations/lib/loading';

import type { Animation } from '../../types';

/** useAnimations "loading" icon (© useanimations.com, CC BY 4.0). */
const loading: Animation = {
  animationKey: 'loading',
  animationData: source.animationData,
  effect: 'LOOP_PLAY',
};

export default loading;
