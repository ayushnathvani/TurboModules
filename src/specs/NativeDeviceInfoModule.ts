/**
 * ✨ TURBOMODULE TYPESCRIPT SPEC
 *
 * KEY DIFFERENCES FROM LEGACY:
 * 1. Location: src/specs/ directory (Codegen looks here)
 * 2. Used by Codegen to generate native C++/Java/Objective-C++ code
 * 3. TurboModuleRegistry.getEnforcing provides runtime type safety
 * 4. Direct import from TurboModuleRegistry with proper interface
 * 5. IDE autocomplete works perfectly
 * 6. Compiler catches type errors before runtime
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

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
interface Spec extends TurboModule {
  getDeviceInfo(): Promise<DeviceInfo>;
}

// 🔑 MODERN PATTERN: TurboModuleRegistry.getEnforcing
// Benefits:
// - Runtime module existence checking
// - Better error messages if module not found
// - Enforces proper TurboModule registration
// - Future-proof with React Native evolution
export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfoModule');
