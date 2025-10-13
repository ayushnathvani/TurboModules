import { NativeModules } from 'react-native';

export interface NetworkInfo {
  type: string; // 'wifi', 'cellular', 'ethernet', 'none', 'unknown'
  isConnected: boolean;
  isInternetReachable: boolean;
}

interface NetworkInfoModuleType {
  getNetworkInfo(): Promise<NetworkInfo>;
}

export default NativeModules.NetworkInfoModule as NetworkInfoModuleType;
