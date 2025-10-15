/**
 * Legacy Implementation - Location Services
 * Uses standard React Native bridge (slower than TurboModule)
 */

import { NativeModules } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  timestamp: number;
}

interface LocationModuleLegacyInterface {
  getCurrentLocation(): Promise<LocationData>;
  requestLocationPermission(): Promise<boolean>;
}

const { LocationModuleLegacy } = NativeModules;

export default LocationModuleLegacy as LocationModuleLegacyInterface;
