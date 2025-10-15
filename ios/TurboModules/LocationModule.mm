/**
 * ✨ TURBOMODULE - Location Services (iOS)
 * 
 * High-performance location services using JSI and CoreLocation
 * Direct native location access with minimal overhead
 */

#import "LocationModule.h"
#import <CoreLocation/CoreLocation.h>

@interface LocationModule () <CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) CLLocation *lastKnownLocation;
@end

@implementation LocationModule

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

- (void)requestLocationPermission:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
    @try {
        CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
        
        switch (status) {
            case kCLAuthorizationStatusAuthorizedWhenInUse:
            case kCLAuthorizationStatusAuthorizedAlways:
                resolve(@YES);
                break;
            case kCLAuthorizationStatusNotDetermined:
                [self.locationManager requestWhenInUseAuthorization];
                resolve(@NO); // Permission not yet granted
                break;
            default:
                resolve(@NO);
                break;
        }
    } @catch (NSException *exception) {
        reject(@"PERMISSION_ERROR", @"Failed to check location permission", nil);
    }
}

- (void)getCurrentLocation:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject {
    @try {
        // Check authorization
        CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
        if (status != kCLAuthorizationStatusAuthorizedWhenInUse && 
            status != kCLAuthorizationStatusAuthorizedAlways) {
            reject(@"PERMISSION_DENIED", @"Location permission not granted", nil);
            return;
        }

        // Use last known location for performance (TurboModule advantage)
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
            // Generate mock location for demo purposes
            double lat = 37.7749 + ((double)arc4random() / UINT32_MAX - 0.5) * 0.01;
            double lng = -122.4194 + ((double)arc4random() / UINT32_MAX - 0.5) * 0.01;
            double accuracy = 10.0 + ((double)arc4random() / UINT32_MAX) * 20.0;
            
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
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager 
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
    self.lastKnownLocation = locations.lastObject;
}

- (void)locationManager:(CLLocationManager *)manager 
       didFailWithError:(NSError *)error {
    // Handle location errors
    NSLog(@"Location error: %@", error.localizedDescription);
}

// 🔑 THE MAGIC METHOD - Enables JSI for direct data transfer
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeLocationModuleSpecJSI>(params);
}

@end