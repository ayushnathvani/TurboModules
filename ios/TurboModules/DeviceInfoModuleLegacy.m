#import "DeviceInfoModuleLegacy.h"
#import <UIKit/UIKit.h>

@implementation DeviceInfoModuleLegacy

RCT_EXPORT_MODULE()

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

@end
