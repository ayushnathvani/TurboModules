/**
 * 🐌 LEGACY BRIDGE IMPLEMENTATION (.m file)
 * 
 * KEY DIFFERENCES FROM TURBOMODULE:
 * 1. File extension: .m (Objective-C only) - NO C++ support
 * 2. NO getTurboModule method - uses old bridge system
 * 3. Requires RCT_EXPORT_METHOD macro for method discovery
 * 4. Goes through React Native Bridge Queue
 * 5. JSON serialization/deserialization overhead
 * 6. All modules loaded at app startup (not lazy)
 * 7. Always asynchronous (no sync calls possible)
 * 8. Slower performance (~60% slower than TurboModule)
 */

#import "DeviceInfoModuleLegacy.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfoModuleLegacy

// Standard module export (same for both)
RCT_EXPORT_MODULE()

// 🔑 KEY DIFFERENCE #1: Requires RCT_EXPORT_METHOD macro
// TurboModule: No macro needed (method defined in Codegen spec)
// Legacy: MUST use macro to register method with bridge
RCT_EXPORT_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIDevice *device = [UIDevice currentDevice];
    
    NSDictionary *deviceInfo = @{
      @"model": device.model ?: @"Unknown",
      @"manufacturer": @"Apple",
      @"osVersion": device.systemVersion ?: @"Unknown",
      @"deviceId": [[[device identifierForVendor] UUIDString] ?: @"Unknown"],
      @"brand": @"Apple"
    };
    
    resolve(deviceInfo);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get device info", nil);
  }
}

// 🔑 KEY DIFFERENCE #2: NO getTurboModule method
// TurboModule has: - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
// Legacy: Missing this method means:
//   - Uses old React Native Bridge
//   - Messages go through queue (batched processing)
//   - JSON serialization required
//   - Cannot make synchronous calls
//   - Loaded at app startup (not lazy)
//   - Slower performance

@end
