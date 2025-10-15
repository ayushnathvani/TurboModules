package com.turbomodules.legacy

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import kotlin.random.Random

/**
 * 🐌 LEGACY BRIDGE - FlatList Data Generator (Android)
 * 
 * Uses React Native Bridge (slower for large data transfers)
 * Data must be serialized to JSON and sent through bridge queue
 */
class FlatListDataModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "FlatListDataModuleLegacy"

    @ReactMethod
    fun generateData(count: Double, promise: Promise) {
        try {
            // Legacy: Goes through bridge (JSON serialization overhead)
            val data = WritableNativeArray()
            val timestamp = System.currentTimeMillis()
            
            for (i in 0 until count.toInt()) {
                val item = WritableNativeMap()
                item.putString("id", "item_$i")
                item.putString("title", "Item $i")
                item.putString("description", "This is the description for item number $i")
                item.putInt("value", Random.nextInt(1000))
                item.putDouble("timestamp", timestamp.toDouble())
                
                data.pushMap(item)
            }
            
            // Data will be serialized to JSON by bridge (slower)
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to generate data", e)
        }
    }
}
