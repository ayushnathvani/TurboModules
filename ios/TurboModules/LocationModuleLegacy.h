/**
 * 🐌 LEGACY MODULE - Location Services (iOS)
 * 
 * Traditional React Native bridge implementation
 * Uses bridge queue with JSON serialization (slower)
 */

#import <React/RCTBridgeModule.h>

@interface LocationModuleLegacy : NSObject <RCTBridgeModule>
@end