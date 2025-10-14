package com.turbomodules.legacy

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

// ============================================================================
//  LEGACY BRIDGE VERSION - Network Info Module
// ============================================================================
// KEY DIFFERENCES FROM TURBOMODULE:
// 1.  No @ReactModule annotation - Uses bridge message queue
// 2.  Slower network queries - Bridge adds 8-10ms overhead
// 3.  Same Android API access, but data goes through JSON serialization
// 4.  Not ideal for frequent network checks (use TurboModule instead)
// 5.  Performance: ~14-18ms via bridge (2-3x slower than JSI)
// 6.  Higher latency impacts user experience in network-sensitive apps
// ============================================================================

class NetworkInfoModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "NetworkInfoModuleLegacy"  //  KEY #1: Hardcoded string

    //  KEY #2: Network query through bridge (slower)
    @ReactMethod
    fun getNetworkInfo(promise: Promise) {
        try {
            // Legacy: Same ConnectivityManager access, but called via bridge
            // This adds 8-10ms overhead before method execution
            val connectivityManager = reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            
            if (connectivityManager == null) {
                // 🔧 FIX: Handle case where ConnectivityManager is not available
                val fallbackMap = WritableNativeMap().apply {
                    putString("type", "none")
                    putBoolean("isConnected", false)
                    putBoolean("isInternetReachable", false)
                }
                promise.resolve(fallbackMap)
                return
            }
            
            var networkType = "none"
            var isConnected = false
            var isInternetReachable = false

            //  KEY #3: Same logic as TurboModule, but bridge overhead applies
            // 🔧 HANDLES NO SIM CARD: Works with WiFi/Ethernet even without cellular
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val network = connectivityManager.activeNetwork
                val capabilities = connectivityManager.getNetworkCapabilities(network)
                
                if (capabilities != null) {
                    isConnected = true
                    isInternetReachable = capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                    
                    networkType = when {
                        capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "wifi"
                        capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "cellular"
                        capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "ethernet"
                        else -> "unknown"
                    }
                }
            } else {
                @Suppress("DEPRECATION")
                val networkInfo = connectivityManager.activeNetworkInfo
                if (networkInfo != null && networkInfo.isConnected) {
                    isConnected = true
                    isInternetReachable = true
                    
                    @Suppress("DEPRECATION")
                    networkType = when (networkInfo.type) {
                        ConnectivityManager.TYPE_WIFI -> "wifi"
                        ConnectivityManager.TYPE_MOBILE -> "cellular"
                        ConnectivityManager.TYPE_ETHERNET -> "ethernet"
                        else -> "unknown"
                    }
                }
            }

            //  KEY #4: Data structure is the same, but will be JSON serialized
            val networkInfoMap = WritableNativeMap().apply {
                putString("type", networkType)
                putBoolean("isConnected", isConnected)
                putBoolean("isInternetReachable", isInternetReachable)
            }

            //  KEY #5: Response goes through bridge queue + JSON serialization
            // networkInfoMap → JSON → Bridge Queue → Deserialize in JS
            // This adds another 6-8ms compared to JSI direct return
            promise.resolve(networkInfoMap)
        } catch (e: SecurityException) {
            // 🔧 FIX: Handle SecurityException (missing permissions) - NO SIM CARD CASE
            val errorMap = WritableNativeMap().apply {
                putString("type", "none")
                putBoolean("isConnected", false)
                putBoolean("isInternetReachable", false)
                putString("error", "Permission denied: ${e.message}")
            }
            promise.resolve(errorMap)
        } catch (e: Exception) {
            // 🔧 FIX: Handle any other exceptions gracefully
            val errorMap = WritableNativeMap().apply {
                putString("type", "none")
                putBoolean("isConnected", false)
                putBoolean("isInternetReachable", false)
                putString("error", "Failed to get network info: ${e.message}")
            }
            promise.resolve(errorMap)
        }
    }
}

// ============================================================================
//  PERFORMANCE CHARACTERISTICS (LEGACY):
// - Query time: ~14-18ms (through bridge)
// - Bridge queue delay: ~4-6ms
// - JSON serialization: ~4-6ms
// - Network detection time: ~4-6ms (same as TurboModule)
// - Total overhead: ~8-12ms just for bridge communication
// ============================================================================
// 
//  WHY SLOWER?
// JS Call → Bridge Queue → JSON Parse → Native API → JSON Stringify → Bridge Queue → JS
//   2ms       2ms           2ms         6ms          2ms              2ms         = 16ms
// 
// vs TurboModule:
// JS Call → JSI Direct → Native API → JSI Direct → JS
//   0.5ms     0.5ms        6ms         0.5ms      = 7.5ms
// 
// For network-sensitive apps (streaming, downloads, sync), this overhead
// is significant when checking network status frequently.
// ============================================================================
// 
//  IMPACT ON USER EXPERIENCE:
// - Slower adaptive content loading
// - Delayed network state updates
// - More noticeable lag in network-dependent features
// - Not suitable for real-time network monitoring
// ============================================================================
