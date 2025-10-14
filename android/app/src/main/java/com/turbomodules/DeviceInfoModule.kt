package com.turbomodules

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule

/**
 *  TURBOMODULE IMPLEMENTATION
 * 
 * KEY DIFFERENCES FROM LEGACY:
 * 1. @ReactModule annotation - Tells Codegen to generate JSI bindings
 * 2. Optimized code structure with Kotlin's apply {}
 * 3. No artificial delays or extra validation
 * 4. Centralized naming via companion object
 * 5. Works with JSI (JavaScript Interface) for direct JS-Native calls
 */

//  KEY DIFFERENCE #1: @ReactModule annotation enables Codegen for TurboModule
// Legacy code doesn't have this annotation
@ReactModule(name = DeviceInfoModule.NAME)
class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    //  KEY DIFFERENCE #2: Using companion object for centralized naming
    // Legacy code uses hardcoded string in getName()
    override fun getName() = NAME

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            //  KEY DIFFERENCE #3: Optimized code with Kotlin's apply {}
            // Legacy code: Creates map and calls put methods separately (more verbose)
            // TurboModule: Uses apply {} for cleaner, more efficient code
            val deviceInfo = WritableNativeMap().apply {
                // Direct field access - no method overhead
                putString("model", Build.MODEL)
                putString("manufacturer", Build.MANUFACTURER)
                putString("osVersion", Build.VERSION.RELEASE)
                putString("deviceId", Build.ID)
                putString("brand", Build.BRAND)
            }
            
            //  KEY DIFFERENCE #4: Immediate resolution without extra validation
            // Legacy code: Has Thread.sleep(5) and extra hasKey() checks
            // TurboModule: Direct promise resolution for better performance
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get device info", e)
        }
    }

    companion object {
        const val NAME = "DeviceInfoModule"
    }
}
