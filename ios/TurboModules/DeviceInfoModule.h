/**
 * ✨ TURBOMODULE HEADER
 * 
 * KEY DIFFERENCES FROM LEGACY:
 * 1. Imports Codegen-generated spec: <React-Codegen/RCTDeviceInfoModuleSpec.h>
 * 2. Implements type-safe protocol: <RCTDeviceInfoModuleSpec>
 * 3. Enables compile-time type checking
 * 4. Auto-generated spec contains exact method signatures
 */

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// KEY DIFFERENCE #1: Imports Codegen-generated spec
// Legacy: Doesn't have this import
// TurboModule: Imports auto-generated spec from React-Codegen
#import <React-Codegen/RCTDeviceInfoModuleSpec.h>

NS_ASSUME_NONNULL_BEGIN

//  KEY DIFFERENCE #2: Implements type-safe Codegen protocol
// Legacy: <RCTBridgeModule> (generic protocol)
// TurboModule: <RCTDeviceInfoModuleSpec> (type-safe, auto-generated)
@interface DeviceInfoModule : NSObject <RCTDeviceInfoModuleSpec>
@end

NS_ASSUME_NONNULL_END
