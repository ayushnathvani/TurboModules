import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface BatteryStatus {
  level: number; // 0-100
  isCharging: boolean;
  chargingType: string; // 'ac', 'usb', 'wireless', 'none'
}

interface Spec extends TurboModule {
  getBatteryStatus(): Promise<BatteryStatus>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BatteryStatusModule');
