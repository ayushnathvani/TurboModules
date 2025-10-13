import { NativeModules } from 'react-native';

const { DeviceInfoModuleLegacy } = NativeModules;

export interface DeviceInfo {
  model: string;
  manufacturer: string;
  osVersion: string;
  deviceId: string;
  brand: string;
}

export default {
  getDeviceInfo: (): Promise<DeviceInfo> => {
    return DeviceInfoModuleLegacy.getDeviceInfo();
  },
};
