#import "ClipboardModuleLegacy.h"
#import <UIKit/UIKit.h>

@implementation ClipboardModuleLegacy

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setString:(NSString *)text
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
    resolve(nil);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to set clipboard text", nil);
  }
}

RCT_EXPORT_METHOD(getString:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *text = pasteboard.string ?: @"";
    resolve(text);
  } @catch (NSException *exception) {
    reject(@"ERROR", @"Failed to get clipboard text", nil);
  }
}

@end
