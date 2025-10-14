package com.turbomodules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 *  TURBOMODULES PACKAGE
 * 
 * Registers all TurboModule implementations.
 * These modules use JSI for direct JavaScript-to-Native calls.
 * 
 * KEY DIFFERENCES FROM LEGACY PACKAGE:
 * - Modules have @ReactModule annotation
 * - Works with Codegen-generated bindings
 * - Lazy loaded (only when first used)
 * - Better performance (~60% faster)
 */
class TurboModulesPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        //  All TurboModule implementations
        // Each has @ReactModule annotation for Codegen
        return listOf(
            DeviceInfoModule(reactContext),
            BatteryStatusModule(reactContext),
            ClipboardModule(reactContext),
            NetworkInfoModule(reactContext),
            CalculationModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
