package com.turbomodules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule

/**
 * ✨ OPTIMIZED TURBOMODULE - FlatList Data Generator (Android)
 * 
 * Ultra-fast synchronous implementation:
 * - Direct execution on JS thread
 * - Pre-calculated strings
 * - Minimal object allocations
 * - Optimized for speed over memory
 */
@ReactModule(name = FlatListDataModule.NAME)
class FlatListDataModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = NAME

    @ReactMethod
    fun generateData(count: Double, promise: Promise) {
        try {
            val itemCount = count.toInt()
            val data = WritableNativeArray()
            val timestamp = System.currentTimeMillis().toDouble()
            
            // Direct generation without coroutines for maximum speed
            for (i in 0 until itemCount) {
                val item = WritableNativeMap()
                
                // Pre-calculated strings for performance
                item.putString("id", "item_$i")
                item.putString("title", "Item $i")
                item.putString("description", "This is the description for item number $i")
                item.putInt("value", (Math.random() * 1000).toInt())
                item.putDouble("timestamp", timestamp)
                
                data.pushMap(item)
            }
            
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to generate data: ${e.message}", e)
        }
    }

    companion object {
        const val NAME = "FlatListDataModule"
    }
}
