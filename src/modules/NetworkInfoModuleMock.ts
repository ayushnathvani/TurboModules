// Mock TurboModule for testing
import { NetworkInfo } from '../specs/NativeNetworkInfoModule';

export default {
  getNetworkInfo: async (): Promise<NetworkInfo> => {
    return {
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
    };
  },
};
