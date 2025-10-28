import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface NetworkInfo {
  type: string; // 'wifi', 'cellular', 'ethernet', 'none', 'unknown'
  isConnected: boolean;
  isInternetReachable: boolean;
  error?: string; // Optional: Error message if network info couldn't be retrieved
}

interface Spec extends TurboModule {
  getNetworkInfo(): Promise<NetworkInfo>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NetworkInfoModule');
