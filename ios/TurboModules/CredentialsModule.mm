/**
 * ✨ PERSISTENT CREDENTIALS TURBOMODULE IMPLEMENTATION (.mm file)
 * 
 * Features:
 * 1. Uses iOS Keychain for secure password storage (never removed)
 * 2. UserDefaults for username suggestions with timestamps
 * 3. Facebook-like credential suggestions and quick login
 * 4. Optimized for performance with minimal allocations
 */

#import "CredentialsModule.h"
#import <Security/Security.h>

static NSString *const kKeychainService = @"TurboModulesCredentials";
static NSString *const kUsernameSuggestionsKey = @"TurboModulesUsernameSuggestions";

@implementation CredentialsModule

RCT_EXPORT_MODULE()

#pragma mark - Keychain Helpers

- (NSMutableDictionary *)keychainQueryForUsername:(NSString *)username {
    return [@{
        (__bridge NSString *)kSecClass: (__bridge NSString *)kSecClassGenericPassword,
        (__bridge NSString *)kSecAttrService: kKeychainService,
        (__bridge NSString *)kSecAttrAccount: username,
    } mutableCopy];
}

- (BOOL)savePasswordToKeychain:(NSString *)password forUsername:(NSString *)username {
    NSData *passwordData = [password dataUsingEncoding:NSUTF8StringEncoding];
    NSMutableDictionary *query = [self keychainQueryForUsername:username];
    
    // Check if item already exists
    OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, NULL);
    
    if (status == errSecSuccess) {
        // Update existing item
        NSDictionary *updateDict = @{
            (__bridge NSString *)kSecValueData: passwordData
        };
        status = SecItemUpdate((__bridge CFDictionaryRef)query, (__bridge CFDictionaryRef)updateDict);
    } else {
        // Add new item
        query[(__bridge NSString *)kSecValueData] = passwordData;
        status = SecItemAdd((__bridge CFDictionaryRef)query, NULL);
    }
    
    return status == errSecSuccess;
}

- (NSString *)getPasswordFromKeychainForUsername:(NSString *)username {
    NSMutableDictionary *query = [self keychainQueryForUsername:username];
    query[(__bridge NSString *)kSecReturnData] = (__bridge NSString *)kCFBooleanTrue;
    query[(__bridge NSString *)kSecMatchLimit] = (__bridge NSString *)kSecMatchLimitOne;
    
    CFDataRef passwordData = NULL;
    OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, (CFTypeRef *)&passwordData);
    
    if (status == errSecSuccess && passwordData != NULL) {
        NSString *password = [[NSString alloc] initWithData:(__bridge NSData *)passwordData 
                                                  encoding:NSUTF8StringEncoding];
        CFRelease(passwordData);
        return password;
    }
    
    return nil;
}

- (NSArray *)getAllStoredCredentialsFromKeychain {
    NSDictionary *query = @{
        (__bridge NSString *)kSecClass: (__bridge NSString *)kSecClassGenericPassword,
        (__bridge NSString *)kSecAttrService: kKeychainService,
        (__bridge NSString *)kSecReturnAttributes: (__bridge NSString *)kCFBooleanTrue,
        (__bridge NSString *)kSecReturnData: (__bridge NSString *)kCFBooleanTrue,
        (__bridge NSString *)kSecMatchLimit: (__bridge NSString *)kSecMatchLimitAll,
    };
    
    CFArrayRef result = NULL;
    OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, (CFTypeRef *)&result);
    
    NSMutableArray *credentials = [NSMutableArray array];
    
    if (status == errSecSuccess && result != NULL) {
        NSArray *items = (__bridge NSArray *)result;
        
        for (NSDictionary *item in items) {
            NSString *username = item[(__bridge NSString *)kSecAttrAccount];
            NSData *passwordData = item[(__bridge NSString *)kSecValueData];
            
            if (username && passwordData) {
                NSString *password = [[NSString alloc] initWithData:passwordData encoding:NSUTF8StringEncoding];
                if (password) {
                    [credentials addObject:@{
                        @"username": username,
                        @"password": password,
                        @"timestamp": @([[NSDate date] timeIntervalSince1970])
                    }];
                }
            }
        }
        
        CFRelease(result);
    }
    
    return credentials;
}

#pragma mark - Username Suggestions Helpers

- (void)updateUsernameSuggestions:(NSString *)username {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableDictionary *suggestions = [([defaults objectForKey:kUsernameSuggestionsKey] ?: @{}) mutableCopy];
    
    // Update timestamp for this username
    suggestions[username] = @([[NSDate date] timeIntervalSince1970]);
    
    [defaults setObject:suggestions forKey:kUsernameSuggestionsKey];
    [defaults synchronize];
}

- (NSArray *)getUsernameSuggestionsArray {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSDictionary *suggestions = [defaults objectForKey:kUsernameSuggestionsKey] ?: @{};
    
    // Sort by timestamp (most recent first)
    NSArray *sortedUsernames = [suggestions keysSortedByValueUsingComparator:^NSComparisonResult(NSNumber *obj1, NSNumber *obj2) {
        return [obj2 compare:obj1]; // Reverse order for most recent first
    }];
    
    NSMutableArray *result = [NSMutableArray array];
    for (NSString *username in sortedUsernames) {
        [result addObject:@{
            @"username": username,
            @"lastUsed": suggestions[username]
        }];
    }
    
    return result;
}

#pragma mark - TurboModule Methods

- (void)saveCredentials:(NSString *)username 
              password:(NSString *)password 
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (!username || !password || username.length == 0 || password.length == 0) {
            reject(@"INVALID_PARAMS", @"Username and password cannot be empty", nil);
            return;
        }
        
        BOOL success = [self savePasswordToKeychain:password forUsername:username];
        if (success) {
            [self updateUsernameSuggestions:username];
            resolve(@(YES));
        } else {
            reject(@"KEYCHAIN_ERROR", @"Failed to save credentials to keychain", nil);
        }
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to save credentials", nil);
    }
}

- (void)getPassword:(NSString *)username
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (!username || username.length == 0) {
            resolve([NSNull null]);
            return;
        }
        
        NSString *password = [self getPasswordFromKeychainForUsername:username];
        resolve(password ?: [NSNull null]);
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to get password", nil);
    }
}

- (void)getUsernameSuggestions:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
    @try {
        NSArray *suggestions = [self getUsernameSuggestionsArray];
        resolve(suggestions);
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to get username suggestions", nil);
    }
}

- (void)getAllStoredCredentials:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject {
    @try {
        NSArray *credentials = [self getAllStoredCredentialsFromKeychain];
        resolve(credentials);
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to get all stored credentials", nil);
    }
}

- (void)hasCredentials:(NSString *)username
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (!username || username.length == 0) {
            resolve(@(NO));
            return;
        }
        
        NSString *password = [self getPasswordFromKeychainForUsername:username];
        resolve(@(password != nil));
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to check credentials", nil);
    }
}

- (void)updateLastUsed:(NSString *)username
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
    @try {
        if (!username || username.length == 0) {
            resolve(@(NO));
            return;
        }
        
        [self updateUsernameSuggestions:username];
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to update last used", nil);
    }
}

// 🔑 THE MAGIC METHOD - Enables JSI for direct data transfer
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeCredentialsModuleSpecJSI>(params);
}

@end