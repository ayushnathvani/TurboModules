/**
 * 🐌 LEGACY BRIDGE IMPLEMENTATION - FlatList Data Generator
 * 
 * Uses React Native Bridge (slower for large data transfers)
 * Data must be serialized to JSON and sent through bridge queue
 */

#import "FlatListDataModuleLegacy.h"

@implementation FlatListDataModuleLegacy

RCT_EXPORT_MODULE()

// 🔑 REQUIRES RCT_EXPORT_METHOD macro
RCT_EXPORT_METHOD(generateData:(double)count
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
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
    
    // Data will be serialized to JSON by bridge (slower)
    resolve(data);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to generate data", nil);
  }
}

@end
