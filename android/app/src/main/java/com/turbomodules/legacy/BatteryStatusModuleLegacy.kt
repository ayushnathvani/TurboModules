package com.turbomodules.legacy

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

// ============================================================================
//  LEGACY BRIDGE VERSION - Battery Status Module
// ============================================================================
// KEY DIFFERENCES FROM TURBOMODULE:
// 1.  No @ReactModule annotation - Uses old bridge system
// 2.  Hardcoded string name - No type safety
// 3.  Goes through React Native Bridge - Message queue overhead
// 4.  JSON serialization - Data converted to/from JSON
// 5.  Eager loading - All legacy modules load at app startup
// 6.  Async only - Cannot make synchronous calls
// 7.  Performance: ~10-14ms typical response time (2-3x slower)
// ============================================================================

class BatteryStatusModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "BatteryStatusModuleLegacy"  //  KEY #1: Hardcoded string (no type safety)

    @ReactMethod
    fun getBatteryStatus(promise: Promise) {
        try {
            //  KEY #2: Legacy goes through React Native Bridge
            // This adds overhead: message queue + JSON serialization
            val context = reactApplicationContext
            val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
                context.registerReceiver(null, ifilter)
            }

            // Calculate battery percentage (same logic as TurboModule)
            val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            val batteryPct: Int = if (level >= 0 && scale > 0) {
                (level * 100 / scale.toFloat()).toInt()
            } else {
                0
            }

            // Check charging status (same logic as TurboModule)
            val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            val isCharging: Boolean = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                    status == BatteryManager.BATTERY_STATUS_FULL

            // Determine charging type (same logic as TurboModule)
            val chargePlug: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1) ?: -1
            val chargingType: String = when (chargePlug) {
                BatteryManager.BATTERY_PLUGGED_USB -> "usb"
                BatteryManager.BATTERY_PLUGGED_AC -> "ac"
                BatteryManager.BATTERY_PLUGGED_WIRELESS -> "wireless"
                else -> "none"
            }

            //  KEY #3: Same code, but this data will be serialized to JSON by bridge
            val batteryInfo = WritableNativeMap().apply {
                putInt("level", batteryPct)
                putBoolean("isCharging", isCharging)
                putString("chargingType", chargingType)
            }

            //  KEY #4: Promise resolution goes through bridge queue
            // Data is serialized to JSON, queued, then deserialized in JavaScript
            promise.resolve(batteryInfo)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get battery status", e)
        }
    }
}

// ============================================================================
//  PERFORMANCE CHARACTERISTICS (LEGACY):
// - Call time: ~10-14ms (through Bridge)
// - Bridge queue delay: ~2-4ms
// - JSON serialization overhead: ~2-3ms
// - Same Android API access as TurboModule
// - ALL legacy modules loaded at startup (memory overhead)
// ============================================================================
// 
//  WHY SLOWER?
// JavaScript → Bridge Queue → JSON Serialize → Native → JSON Deserialize → JavaScript
// vs TurboModule: JavaScript → JSI Direct Call → Native → Direct Return → JavaScript
// ============================================================================
