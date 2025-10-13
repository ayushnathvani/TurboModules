import { NativeModules } from 'react-native';

const { NetworkInfoModuleLegacy } = NativeModules;

export interface NetworkInfo {
  type: string;
  isConnected: boolean;
  isInternetReachable: boolean;
}

export default {
  getNetworkInfo: (): Promise<NetworkInfo> => {
    return NetworkInfoModuleLegacy.getNetworkInfo();
  },
};
