import { NativeModules } from 'react-native';

export interface DeviceInfo {
  model: string;
  manufacturer: string;
  osVersion: string;
  deviceId: string;
  brand: string;
}

interface DeviceInfoModuleType {
  getDeviceInfo(): Promise<DeviceInfo>;
}

export default NativeModules.DeviceInfoModule as DeviceInfoModuleType;
