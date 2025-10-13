// Mock TurboModule for testing
import { BatteryStatus } from '../specs/NativeBatteryStatusModule';

export default {
  getBatteryStatus: async (): Promise<BatteryStatus> => {
    return {
      level: 75,
      isCharging: false,
      chargingType: 'none',
    };
  },
};
