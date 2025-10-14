import { NativeModules } from 'react-native';

export interface NetworkInfo {
  type: string; // 'wifi', 'cellular', 'ethernet', 'none', 'unknown'
  isConnected: boolean;
  isInternetReachable: boolean;
  error?: string; // Optional: Error message if network info couldn't be retrieved
}

interface NetworkInfoModuleType {
  getNetworkInfo(): Promise<NetworkInfo>;
}

export default NativeModules.NetworkInfoModule as NetworkInfoModuleType;
