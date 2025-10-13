package com.turbomodules.legacy

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class LegacyModulesPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
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
