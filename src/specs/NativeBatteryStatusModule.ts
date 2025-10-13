import { NativeModules } from 'react-native';

export interface BatteryStatus {
  level: number; // 0-100
  isCharging: boolean;
  chargingType: string; // 'ac', 'usb', 'wireless', 'none'
}

interface BatteryStatusModuleType {
  getBatteryStatus(): Promise<BatteryStatus>;
}

export default NativeModules.BatteryStatusModule as BatteryStatusModuleType;
