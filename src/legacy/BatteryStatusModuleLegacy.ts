import { NativeModules } from 'react-native';

const { BatteryStatusModuleLegacy } = NativeModules;

export interface BatteryStatus {
  level: number;
  isCharging: boolean;
  chargingType: string;
}

export default {
  getBatteryStatus: (): Promise<BatteryStatus> => {
    return BatteryStatusModuleLegacy.getBatteryStatus();
  },
};
