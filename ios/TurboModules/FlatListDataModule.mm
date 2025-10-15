/**
 * ✨ TURBOMODULE IMPLEMENTATION - FlatList Data Generator
 * 
 * Demonstrates JSI performance advantage for large data transfers
 * TurboModule transfers data directly via JSI (no JSON serialization)
 */

#import "FlatListDataModule.h"

@implementation FlatListDataModule

RCT_EXPORT_MODULE()

- (void)generateData:(double)count
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  @try {
    NSMutableArray *data = [NSMutableArray arrayWithCapacity:(int)count];
    
    for (int i = 0; i < (int)count; i++) {
      NSDictionary *item = @{
        @"id": [NSString stringWithFormat:@"item_%d", i],
        @"title": [NSString stringWithFormat:@"Item %d", i],
        @"description": [NSString stringWithFormat:@"This is the description for item number %d", i],
        @"value": @(arc4random_uniform(1000)),
        @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000)
      };
      [data addObject:item];
    }
    
    resolve(data);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to generate data", nil);
  }
}

// 🔑 THE MAGIC METHOD - Enables JSI for direct data transfer
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeFlatListDataModuleSpecJSI>(params);
}

@end
