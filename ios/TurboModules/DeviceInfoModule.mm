/**
 * ✨ ULTRA-OPTIMIZED TURBOMODULE IMPLEMENTATION (.mm file)
 * 
 * Performance optimizations:
 * 1. Pre-cached device info (static initialization)
 * 2. Minimal object allocations
 * 3. Static NSDictionary creation
 * 4. No UIDevice instance creation on each call
 */

#import "DeviceInfoModule.h"
#import <UIKit/UIKit.h>

// Pre-cache device info for maximum performance
static NSDictionary *cachedDeviceInfo = nil;

@implementation DeviceInfoModule

// Initialize cached device info once
+ (void)initialize {
    if (self == [DeviceInfoModule class]) {
        UIDevice *device = [UIDevice currentDevice];
        cachedDeviceInfo = @{
            @"model": device.model ?: @"Unknown",
            @"manufacturer": @"Apple",
            @"osVersion": device.systemVersion ?: @"Unknown",
            @"deviceId": [[[device identifierForVendor] UUIDString] ?: @"Unknown"],
            @"brand": @"Apple"
        };
    }
}

RCT_EXPORT_MODULE()

- (void)getDeviceInfo:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  @try {
    // Ultra-fast path: return pre-cached dictionary
    resolve(cachedDeviceInfo);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get device info", nil);
  }
}

// 🔑 THE MAGIC METHOD - Enables JSI for direct data transfer
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeDeviceInfoModuleSpecJSI>(params);
}

@end
