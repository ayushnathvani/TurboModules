/**
 * 🐌 LEGACY MODULE - Location Services (iOS)
 * 
 * Traditional React Native bridge implementation with CoreLocation
 * Goes through bridge queue with JSON serialization (slower)
 */

#import "LocationModuleLegacy.h"
#import <CoreLocation/CoreLocation.h>

@interface LocationModuleLegacy () <CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) CLLocation *lastKnownLocation;
@end

@implementation LocationModuleLegacy

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    }
    return self;
}

RCT_EXPORT_METHOD(requestLocationPermission:(RCTPromiseResolveBlock)resolve
                                     reject:(RCTPromiseRejectBlock)reject) {
    // Simulate bridge overhead with small delay
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.005 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        @try {
            CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
            
            switch (status) {
                case kCLAuthorizationStatusAuthorizedWhenInUse:
                case kCLAuthorizationStatusAuthorizedAlways:
                    resolve(@YES);
                    break;
                case kCLAuthorizationStatusNotDetermined:
                    [self.locationManager requestWhenInUseAuthorization];
                    resolve(@NO);
                    break;
                default:
                    resolve(@NO);
                    break;
            }
        } @catch (NSException *exception) {
            reject(@"PERMISSION_ERROR", @"Failed to check location permission", nil);
        }
    });
}

RCT_EXPORT_METHOD(getCurrentLocation:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject) {
    // Simulate bridge overhead with small delay
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.010 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        @try {
            // Check authorization
            CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
            if (status != kCLAuthorizationStatusAuthorizedWhenInUse && 
                status != kCLAuthorizationStatusAuthorizedAlways) {
                reject(@"PERMISSION_DENIED", @"Location permission not granted", nil);
                return;
            }

            // Get location (same logic as TurboModule but with bridge overhead)
            CLLocation *location = self.locationManager.location ?: self.lastKnownLocation;
            
            if (location) {
                NSDictionary *locationData = @{
                    @"latitude": @(location.coordinate.latitude),
                    @"longitude": @(location.coordinate.longitude),
                    @"accuracy": @(location.horizontalAccuracy),
                    @"altitude": @(location.altitude),
                    @"speed": @(location.speed),
                    @"timestamp": @([location.timestamp timeIntervalSince1970] * 1000)
                };
                resolve(locationData);
            } else {
                // Generate mock location for demo
                double lat = 37.7749 + ((double)arc4random() / UINT32_MAX - 0.5) * 0.01;
                double lng = -122.4194 + ((double)arc4random() / UINT32_MAX - 0.5) * 0.01;
                double accuracy = 15.0 + ((double)arc4random() / UINT32_MAX) * 25.0; // Slightly less accurate
                
                NSDictionary *mockLocation = @{
                    @"latitude": @(lat),
                    @"longitude": @(lng),
                    @"accuracy": @(accuracy),
                    @"altitude": @(50.0 + ((double)arc4random() / UINT32_MAX) * 100.0),
                    @"speed": @(0.0),
                    @"timestamp": @([[NSDate date] timeIntervalSince1970] * 1000)
                };
                resolve(mockLocation);
            }
        } @catch (NSException *exception) {
            reject(@"LOCATION_ERROR", @"Failed to get current location", nil);
        }
    });
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager 
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
    self.lastKnownLocation = locations.lastObject;
}

- (void)locationManager:(CLLocationManager *)manager 
       didFailWithError:(NSError *)error {
    NSLog(@"Location error: %@", error.localizedDescription);
}

@end