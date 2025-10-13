package com.turbomodules.legacy

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

class DeviceInfoModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "DeviceInfoModuleLegacy"

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            val deviceInfo = WritableNativeMap().apply {
                putString("model", Build.MODEL)
                putString("manufacturer", Build.MANUFACTURER)
                putString("osVersion", Build.VERSION.RELEASE)
                putString("deviceId", Build.ID)
                putString("brand", Build.BRAND)
            }
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get device info", e)
        }
    }
}
