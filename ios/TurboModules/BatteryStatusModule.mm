#import "BatteryStatusModule.h"
#import <UIKit/UIKit.h>

@implementation BatteryStatusModule

RCT_EXPORT_MODULE()

- (void)getBatteryStatus:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  @try {
    UIDevice *device = [UIDevice currentDevice];
    device.batteryMonitoringEnabled = YES;
    
    float batteryLevel = device.batteryLevel;
    UIDeviceBatteryState batteryState = device.batteryState;
    
    BOOL isCharging = (batteryState == UIDeviceBatteryStateCharging || 
                       batteryState == UIDeviceBatteryStateFull);
    
    NSString *chargingType = @"none";
    if (batteryState == UIDeviceBatteryStateCharging) {
      chargingType = @"ac"; // iOS doesn't differentiate charging types easily
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

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBatteryStatusModuleSpecJSI>(params);
}

@end
