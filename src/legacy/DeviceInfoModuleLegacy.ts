/**
 * 🐌 LEGACY BRIDGE TYPESCRIPT WRAPPER
 *
 * KEY DIFFERENCES FROM TURBOMODULE:
 * 1. Location: src/legacy/ directory (NOT read by Codegen)
 * 2. NOT used by Codegen - no native code generation
 * 3. Manual wrapper function instead of type assertion
 * 4. Runtime type checking only (not compile-time)
 * 5. More boilerplate code
 * 6. Goes through React Native Bridge (slower)
 */

import { NativeModules } from 'react-native';

// 🔑 KEY DIFFERENCE #1: Runtime lookup with destructuring
// TurboModule: Direct reference with type assertion
// Legacy: Extracts module from NativeModules at runtime
const { DeviceInfoModuleLegacy } = NativeModules;

export interface DeviceInfo {
  model: string;
  manufacturer: string;
  osVersion: string;
  deviceId: string;
  brand: string;
}

// 🔑 KEY DIFFERENCE #2: Manual wrapper object
// TurboModule: export default NativeModules.Module as Type (clean)
// Legacy: export default { method: () => { ... } } (verbose)
//
// Why manual wrapper?
// - Legacy bridge requires this pattern
// - No Codegen to generate bindings
// - Runtime method discovery only
// - More boilerplate code needed
export default {
  getDeviceInfo: (): Promise<DeviceInfo> => {
    // 🔑 Calls through React Native Bridge:
    // 1. JavaScript creates message
    // 2. Message serialized to JSON
    // 3. Added to bridge queue
    // 4. Bridge processes queue (batched)
    // 5. Native method called
    // 6. Result serialized to JSON
    // 7. Bridge returns to JavaScript
    // 8. Promise resolved
    // Total time: ~13ms (vs ~5ms for TurboModule)
    return DeviceInfoModuleLegacy.getDeviceInfo();
  },
};
