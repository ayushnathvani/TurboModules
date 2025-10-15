package com.turbomodules.legacy

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

/**
 * 🐌 LEGACY MODULE - Location Services (Android)
 * 
 * Traditional React Native bridge implementation
 * Goes through bridge queue with JSON serialization (slower)
 */
class LocationModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "LocationModuleLegacy"

    private val locationManager: LocationManager by lazy {
        reactApplicationContext.getSystemService(android.content.Context.LOCATION_SERVICE) as LocationManager
    }

    @ReactMethod
    fun requestLocationPermission(promise: Promise) {
        try {
            // Add some artificial delay to simulate bridge overhead
            Thread.sleep(5) // 5ms delay
            
            val hasPermission = ContextCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            promise.resolve(hasPermission)
        } catch (e: Exception) {
            promise.reject("PERMISSION_ERROR", "Failed to check location permission", e)
        }
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            // Add some artificial delay to simulate bridge overhead
            Thread.sleep(10) // 10ms delay
            
            // Check permission
            if (ContextCompat.checkSelfPermission(
                    reactApplicationContext,
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                promise.reject("PERMISSION_DENIED", "Location permission not granted")
                return
            }

            // Get location (same logic as TurboModule but with bridge overhead)
            val location = getLastKnownLocation()
            
            if (location != null) {
                val locationData = WritableNativeMap().apply {
                    putDouble("latitude", location.latitude)
                    putDouble("longitude", location.longitude)
                    putDouble("accuracy", location.accuracy.toDouble())
                    putDouble("altitude", location.altitude)
                    putDouble("speed", location.speed.toDouble())
                    putDouble("timestamp", location.time.toDouble())
                }
                promise.resolve(locationData)
            } else {
                // Generate mock location for demo
                val mockLocation = WritableNativeMap().apply {
                    putDouble("latitude", 37.7749 + (Math.random() - 0.5) * 0.01)
                    putDouble("longitude", -122.4194 + (Math.random() - 0.5) * 0.01)
                    putDouble("accuracy", 15.0 + Math.random() * 25) // Slightly less accurate
                    putDouble("altitude", 50.0 + Math.random() * 100)
                    putDouble("speed", 0.0)
                    putDouble("timestamp", System.currentTimeMillis().toDouble())
                }
                promise.resolve(mockLocation)
            }
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", "Failed to get current location: ${e.message}", e)
        }
    }

    private fun getLastKnownLocation(): Location? {
        return try {
            val providers = listOf(
                LocationManager.GPS_PROVIDER,
                LocationManager.NETWORK_PROVIDER,
                LocationManager.PASSIVE_PROVIDER
            )

            var bestLocation: Location? = null
            
            for (provider in providers) {
                if (locationManager.isProviderEnabled(provider)) {
                    val location = locationManager.getLastKnownLocation(provider)
                    if (location != null && (bestLocation == null || location.accuracy < bestLocation.accuracy)) {
                        bestLocation = location
                    }
                }
            }
            
            bestLocation
        } catch (e: SecurityException) {
            null
        }
    }
}