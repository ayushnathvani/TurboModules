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

class NetworkInfoModuleLegacy(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "NetworkInfoModuleLegacy"

    @ReactMethod
    fun getNetworkInfo(promise: Promise) {
        try {
            val connectivityManager = reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            
            var networkType = "none"
            var isConnected = false
            var isInternetReachable = false

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

            val networkInfoMap = WritableNativeMap().apply {
                putString("type", networkType)
                putBoolean("isConnected", isConnected)
                putBoolean("isInternetReachable", isInternetReachable)
            }

            promise.resolve(networkInfoMap)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get network info", e)
        }
    }
}
