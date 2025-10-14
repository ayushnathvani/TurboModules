import { NativeModules } from 'react-native';

const { NetworkInfoModuleLegacy } = NativeModules;

export interface NetworkInfo {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean;
  error?: string; // Optional: Error message if network info couldn't be retrieved
}

export default {
  getNetworkInfo: (): Promise<NetworkInfo> => {
    return NetworkInfoModuleLegacy.getNetworkInfo();
  },
};
