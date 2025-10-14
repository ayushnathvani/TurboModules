package com.turbomodules.legacy

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

/**
 * LEGACY BRIDGE IMPLEMENTATION
 * 
 * KEY DIFFERENCES FROM TURBOMODULE:
 * 1. NO @ReactModule annotation - Uses old bridge system
 * 2. Hardcoded string in getName() instead of companion object
 * 3. Has artificial delay (Thread.sleep) to simulate bridge overhead
 * 4. Extra validation checks (hasKey) before resolving
 * 5. More verbose code structure
 * 6. Goes through React Native Bridge Queue (slower)
 * 7. JSON serialization overhead
 * 8. NOT used by Codegen
 */

//  KEY DIFFERENCE #1: NO @ReactModule annotation
// TurboModule has: @ReactModule(name = DeviceInfoModule.NAME)
// Legacy: No annotation = No Codegen = Uses old bridge
class DeviceInfoModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    //  KEY DIFFERENCE #2: Hardcoded string instead of companion object constant
    // TurboModule uses: companion object { const val NAME = "..." }
    override fun getName() = "DeviceInfoModuleLegacy"

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            //  KEY DIFFERENCE #3: Artificial delay to simulate bridge overhead
            // TurboModule: No delay - direct JSI call is fast
            // Legacy: Has delay because it goes through bridge queue + JSON serialization
            Thread.sleep(5) // 5ms delay to demonstrate bridge overhead
            
            //  KEY DIFFERENCE #4: More verbose code structure
            // TurboModule uses: WritableNativeMap().apply { ... }
            // Legacy: Create map, then call put methods separately
            val deviceInfo = WritableNativeMap()
            deviceInfo.putString("model", Build.MODEL)
            deviceInfo.putString("manufacturer", Build.MANUFACTURER)
            deviceInfo.putString("osVersion", Build.VERSION.RELEASE)
            deviceInfo.putString("deviceId", Build.ID)
            deviceInfo.putString("brand", Build.BRAND)
            
            //  KEY DIFFERENCE #5: Extra validation before resolving
            // TurboModule: Direct promise.resolve() - trusts the data
            // Legacy: Extra hasKey() check adds unnecessary overhead
            if (deviceInfo.hasKey("model")) {
                promise.resolve(deviceInfo)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get device info", e)
        }
    }
}
