#import "BatteryStatusModuleLegacy.h"
#import <UIKit/UIKit.h>

@implementation BatteryStatusModuleLegacy

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getBatteryStatus:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIDevice *device = [UIDevice currentDevice];
    device.batteryMonitoringEnabled = YES;
    
    float batteryLevel = device.batteryLevel;
    UIDeviceBatteryState batteryState = device.batteryState;
    
    BOOL isCharging = (batteryState == UIDeviceBatteryStateCharging || 
                       batteryState == UIDeviceBatteryStateFull);
    
    NSString *chargingType = @"none";
    if (batteryState == UIDeviceBatteryStateCharging) {
      chargingType = @"ac";
    } else if (batteryState == UIDeviceBatteryStateFull) {
      chargingType = @"ac";
    }
    
    NSDictionary *batteryStatus = @{
      @"level": @((int)(batteryLevel * 100)),
      @"isCharging": @(isCharging),
      @"chargingType": chargingType
    };
    
    resolve(batteryStatus);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get battery status", nil);
  }
}

@end
