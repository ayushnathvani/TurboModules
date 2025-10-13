#import "NetworkInfoModuleLegacy.h"
#import <SystemConfiguration/SystemConfiguration.h>

@implementation NetworkInfoModuleLegacy

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getNetworkInfo:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSString *networkType = [self getCurrentNetworkType];
    BOOL isConnected = [self isConnectedToNetwork];
    
    NSDictionary *networkInfo = @{
      @"type": networkType,
      @"isConnected": @(isConnected),
      @"isInternetReachable": @(isConnected)
    };
    
    resolve(networkInfo);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get network info", nil);
  }
}

- (NSString *)getCurrentNetworkType {
  SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(NULL, "www.google.com");
  SCNetworkReachabilityFlags flags;
  
  if (SCNetworkReachabilityGetFlags(reachability, &flags)) {
    CFRelease(reachability);
    
    if ((flags & kSCNetworkReachabilityFlagsReachable) == 0) {
      return @"none";
    }
    
    if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
      return @"cellular";
    }
    
    return @"wifi";
  }
  
  if (reachability) {
    CFRelease(reachability);
  }
  
  return @"unknown";
}

- (BOOL)isConnectedToNetwork {
  SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(NULL, "www.google.com");
  SCNetworkReachabilityFlags flags;
  BOOL success = SCNetworkReachabilityGetFlags(reachability, &flags);
  CFRelease(reachability);
  
  if (!success) {
    return NO;
  }
  
  BOOL isReachable = ((flags & kSCNetworkReachabilityFlagsReachable) != 0);
  BOOL needsConnection = ((flags & kSCNetworkReachabilityFlagsConnectionRequired) != 0);
  
  return (isReachable && !needsConnection);
}

@end
