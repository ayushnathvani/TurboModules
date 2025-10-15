/**
 * TurboModule Spec for Location Services
 * Demonstrates JSI performance for geolocation operations
 */

import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  timestamp: number;
}

export interface Spec extends TurboModule {
  getCurrentLocation(): Promise<LocationData>;
  requestLocationPermission(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocationModule');
