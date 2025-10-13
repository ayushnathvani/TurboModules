#import "DeviceInfoModule.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfoModule

RCT_EXPORT_MODULE()

- (void)getDeviceInfo:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
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

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeDeviceInfoModuleSpecJSI>(params);
}

@end
