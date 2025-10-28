import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface Spec extends TurboModule {
  setString(text: string): Promise<void>;
  getString(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ClipboardModule');
