package com.turbomodules

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.turbomodules.legacy.LegacyModulesPackage

/**
 * MAIN APPLICATION - Registers both TurboModules and Legacy modules
 * 
 * This demonstrates that React Native 0.80 supports BOTH architectures:
 *  TurboModules (New Architecture) - JSI + Codegen
 *  Legacy Bridge (Old Architecture) - Bridge queue + JSON
 * 
 * In production, you would typically choose ONE approach per module.
 * This app registers both for performance comparison demo purposes.
 */
class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              //  KEY DIFFERENCE: Both packages registered for comparison
              
              //  TurboModules Package (NEW Architecture)
              // - Uses @ReactModule annotation
              // - JSI direct calls
              // - Lazy loaded
              // - ~5ms average call time
              add(TurboModulesPackage())
              
              //  Legacy Modules Package (OLD Architecture)
              // - No @ReactModule annotation
              // - Bridge queue + JSON
              // - Eager loaded at startup
              // - ~13ms average call time
              add(LegacyModulesPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
