// Mock TurboModule for testing - will be replaced with real implementation
import { DeviceInfo } from '../specs/NativeDeviceInfoModule';

export default {
  getDeviceInfo: async (): Promise<DeviceInfo> => {
    return {
      model: 'Mock Device',
      manufacturer: 'Mock Manufacturer',
      osVersion: '1.0',
      deviceId: 'mock-id-123',
      brand: 'Mock Brand',
    };
  },
};
