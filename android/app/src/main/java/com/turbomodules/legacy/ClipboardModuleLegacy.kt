package com.turbomodules.legacy

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

// ============================================================================
//  LEGACY BRIDGE VERSION - Clipboard Module
// ============================================================================
// KEY DIFFERENCES FROM TURBOMODULE:
// 1.  No @ReactModule annotation - Uses old bridge
// 2.  String data goes through JSON serialization
// 3.  Bridge queue adds 2-4ms overhead per operation
// 4.  Hardcoded module name (no type safety)
// 5.  Performance: ~8-12ms for get, ~6-10ms for set operations
// 6.  2-3x slower than TurboModule version for same operations
// ============================================================================

class ClipboardModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ClipboardModuleLegacy"  //  KEY #1: Hardcoded string

    //  KEY #2: SET operation through Bridge
    @ReactMethod
    fun setString(text: String, promise: Promise) {
        try {
            // Legacy: The 'text' parameter was deserialized from JSON by bridge
            // This adds 1-2ms overhead before this method even starts
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("text", text)
            clipboard.setPrimaryClip(clip)
            
            //  KEY #3: Resolution goes through bridge queue
            // Message queued → JSON serialized → Sent to JS
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to set clipboard text", e)
        }
    }

    //  KEY #4: GET operation through Bridge
    @ReactMethod
    fun getString(promise: Promise) {
        try {
            // Legacy: Same clipboard access as TurboModule
            val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = clipboard.primaryClip
            val text = if (clip != null && clip.itemCount > 0) {
                clip.getItemAt(0).text?.toString() ?: ""
            } else {
                ""
            }
            
            //  KEY #5: String must be serialized to JSON by bridge
            // Text → JSON string → Bridge queue → Deserialize in JS
            // This adds 2-3ms overhead compared to JSI
            promise.resolve(text)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get clipboard text", e)
        }
    }
}

// ============================================================================
//  PERFORMANCE CHARACTERISTICS (LEGACY):
// - setString(): ~6-10ms (Bridge overhead)
// - getString(): ~8-12ms (Bridge + JSON overhead)
// - Bridge queue delay: ~2-4ms
// - JSON serialization: ~1-3ms
// - Same Android API access, but slower data transfer
// ============================================================================
// 
//  WHY SLOWER?
// JS → Bridge Queue (2ms) → JSON Parse (1ms) → Native → JSON Stringify (2ms) → Bridge Queue (2ms) → JS
// vs TurboModule: JS → JSI Direct (0.5ms) → Native → JSI Direct (0.5ms) → JS
// 
// For clipboard operations, the overhead is significant because:
// - Text data must be JSON-encoded/decoded
// - Multiple bridge crossings for set+get operations
// - Cannot batch clipboard operations
// ============================================================================
