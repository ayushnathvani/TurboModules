package com.turbomodules.legacy

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 *  LEGACY MODULES PACKAGE
 * 
 * Registers all Legacy Bridge implementations.
 * These modules use the old React Native Bridge system.
 * 
 * KEY DIFFERENCES FROM TURBOMODULES PACKAGE:
 * - Modules have NO @ReactModule annotation
 * - Uses old bridge messaging system
 * - All loaded at app startup (eager loading)
 * - Goes through bridge queue + JSON serialization
 * - Slower performance (~60% slower than TurboModules)
 */
class LegacyModulesPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        //  All Legacy Bridge implementations
        // No @ReactModule annotation - uses old bridge
        return listOf(
            DeviceInfoModuleLegacy(reactContext),
            BatteryStatusModuleLegacy(reactContext),
            ClipboardModuleLegacy(reactContext),
            NetworkInfoModuleLegacy(reactContext),
            CalculationModuleLegacy(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
