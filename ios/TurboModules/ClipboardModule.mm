#import "ClipboardModule.h"
#import <UIKit/UIKit.h>

@implementation ClipboardModule

RCT_EXPORT_MODULE()

- (void)setString:(NSString *)text
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  @try {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
    resolve(nil);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to set clipboard text", nil);
  }
}

- (void)getString:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  @try {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *text = pasteboard.string ?: @"";
    resolve(text);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get clipboard text", nil);
  }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeClipboardModuleSpecJSI>(params);
}

@end
