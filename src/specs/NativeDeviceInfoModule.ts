/**
 * ✨ TURBOMODULE TYPESCRIPT SPEC
 *
 * KEY DIFFERENCES FROM LEGACY:
 * 1. Location: src/specs/ directory (Codegen looks here)
 * 2. Used by Codegen to generate native C++/Java/Objective-C++ code
 * 3. Type assertion provides compile-time type safety
 * 4. Direct import from NativeModules with type casting
 * 5. IDE autocomplete works perfectly
 * 6. Compiler catches type errors before runtime
 */

import { NativeModules } from 'react-native';

// 🔑 Exported interface - defines the data structure
// This tells TypeScript AND Codegen what the return type looks like
export interface DeviceInfo {
  model: string;
  manufacturer: string;
  osVersion: string;
  deviceId: string;
  brand: string;
}

// 🔑 Module interface - defines the methods available
// Codegen reads this to generate native bindings
interface DeviceInfoModuleType {
  getDeviceInfo(): Promise<DeviceInfo>;
}

// 🔑 KEY DIFFERENCE: Type assertion with "as"
// Legacy: Uses manual wrapper function
// TurboModule: Direct cast provides compile-time type safety
//
// What this does:
// - Tells TypeScript the exact type of NativeModules.DeviceInfoModule
// - Enables IDE autocomplete and IntelliSense
// - Compiler will catch type errors
// - Codegen uses this file to generate native code
export default NativeModules.DeviceInfoModule as DeviceInfoModuleType;
