package com.turbomodules

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule

/**
 * ✨ ULTRA-OPTIMIZED TURBOMODULE IMPLEMENTATION
 * 
 * Performance optimizations:
 * 1. Pre-cached device info (static initialization)
 * 2. Minimal object allocations
 * 3. Direct field access
 * 4. No exception handling overhead in normal path
 */

@ReactModule(name = DeviceInfoModule.NAME)
class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = NAME

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        // Ultra-fast path: use pre-cached values
        try {
            val deviceInfo = WritableNativeMap()
            
            // Direct assignments - fastest possible approach
            deviceInfo.putString("model", CACHED_MODEL)
            deviceInfo.putString("manufacturer", CACHED_MANUFACTURER)
            deviceInfo.putString("osVersion", CACHED_OS_VERSION)
            deviceInfo.putString("deviceId", CACHED_DEVICE_ID)
            deviceInfo.putString("brand", CACHED_BRAND)
            
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get device info", e)
        }
    }

    companion object {
        const val NAME = "DeviceInfoModule"
        
        // Pre-cache all device info at class loading time for maximum performance
        private val CACHED_MODEL = Build.MODEL ?: "Unknown"
        private val CACHED_MANUFACTURER = Build.MANUFACTURER ?: "Unknown"
        private val CACHED_OS_VERSION = Build.VERSION.RELEASE ?: "Unknown"
        private val CACHED_DEVICE_ID = Build.ID ?: "Unknown"
        private val CACHED_BRAND = Build.BRAND ?: "Unknown"
    }
}
