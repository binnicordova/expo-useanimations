import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoUseanimationsModule extends NativeModule<{}> {}

export default requireNativeModule<ExpoUseanimationsModule>('ExpoUseanimations');
