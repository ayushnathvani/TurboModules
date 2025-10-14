/**
 * 🐌 LEGACY BRIDGE HEADER
 * 
 * KEY DIFFERENCES FROM TURBOMODULE:
 * 1. NO Codegen spec import - uses basic bridge only
 * 2. Implements generic protocol: <RCTBridgeModule>
 * 3. NO compile-time type checking
 * 4. Runtime method discovery only
 */

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// 🔑 KEY DIFFERENCE #1: NO Codegen import
// TurboModule has: #import <React-Codegen/RCTDeviceInfoModuleSpec.h>
// Legacy: Only imports basic RCTBridgeModule

// 🔑 KEY DIFFERENCE #2: Generic bridge protocol
// TurboModule: <RCTDeviceInfoModuleSpec> (type-safe)
// Legacy: <RCTBridgeModule> (generic, no type safety)
@interface DeviceInfoModuleLegacy : NSObject <RCTBridgeModule>
@end
