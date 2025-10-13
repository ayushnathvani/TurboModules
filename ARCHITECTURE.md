# TurboModules Architecture Diagram

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Native App                          │
│                         (JavaScript)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  Device Info  │  │    Battery    │  │   Clipboard   │       │
│  │      Tab      │  │  Status Tab   │  │      Tab      │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐                          │
│  │   Network     │  │  Calculation  │                          │
│  │  Info Tab     │  │      Tab      │                          │
│  └───────────────┘  └───────────────┘                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Calls both implementations
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                             │
        ▼                                             ▼
┌─────────────────┐                         ┌─────────────────┐
│  TurboModules   │                         │ Legacy Bridge   │
│   (via JSI)     │                         │  (via Bridge)   │
└─────────────────┘                         └─────────────────┘
        │                                             │
        │ Direct Call                                 │ Async Bridge
        │ (Fast! ⚡)                                  │ (Slower 🐌)
        │                                             │
┌───────┴────────────────────────────────────────────┴────────┐
│                    Native Platform                           │
│                   (iOS / Android)                            │
└──────────────────────────────────────────────────────────────┘
```

## 📊 TurboModule Flow

```
JavaScript Layer
     │
     │ 1. Call TurboModule method
     │    Example: DeviceInfoModule.getDeviceInfo()
     ▼
┌─────────────────────────────────────────┐
│      TypeScript Spec Interface          │
│   (src/specs/NativeDeviceInfoModule.ts) │
└─────────────────────────────────────────┘
     │
     │ 2. JSI (JavaScript Interface)
     │    Direct native invocation
     ▼
┌─────────────────────────────────────────┐
│         Codegen Generated Code          │
│     (Auto-generated at build time)      │
└─────────────────────────────────────────┘
     │
     │ 3. Native method call
     │    Type-safe, direct memory access
     ▼
┌─────────────────────────────────────────┐
│      Native Implementation              │
│  iOS: DeviceInfoModule.mm               │
│  Android: DeviceInfoModule.kt           │
└─────────────────────────────────────────┘
     │
     │ 4. Return result
     │    Efficient serialization
     ▼
JavaScript Layer (Result received)
```

## 🐌 Legacy Bridge Flow

```
JavaScript Layer
     │
     │ 1. Call Legacy module method
     │    Example: DeviceInfoModuleLegacy.getDeviceInfo()
     ▼
┌─────────────────────────────────────────┐
│        NativeModules Wrapper            │
│ (src/legacy/DeviceInfoModuleLegacy.ts) │
└─────────────────────────────────────────┘
     │
     │ 2. Message queued to bridge
     │    Async, serialization overhead
     ▼
┌─────────────────────────────────────────┐
│         React Native Bridge             │
│        (JSON serialization)             │
└─────────────────────────────────────────┘
     │
     │ 3. Bridge forwards message
     │    Additional overhead
     ▼
┌─────────────────────────────────────────┐
│      Native Implementation              │
│  iOS: DeviceInfoModuleLegacy.m          │
│  Android: DeviceInfoModuleLegacy.kt     │
└─────────────────────────────────────────┘
     │
     │ 4. Result serialized back
     │    Through bridge
     ▼
┌─────────────────────────────────────────┐
│         React Native Bridge             │
│        (JSON deserialization)           │
└─────────────────────────────────────────┘
     │
     │ 5. Callback invoked
     │    Promise resolved
     ▼
JavaScript Layer (Result received)
```

## ⚡ Performance Comparison

```
TurboModule Call Time:     [========] ~5ms
                            ↑
                            Direct JSI call

Legacy Bridge Call Time:   [===============] ~12ms
                            ↑
                            Bridge + JSON serialization
```

## 📱 Module Architecture

Each module has the following structure:

```
Module Name (e.g., DeviceInfo)
│
├── 📄 TypeScript Spec
│   └── src/specs/NativeDeviceInfoModule.ts
│       ├── Interface definition
│       ├── Type definitions
│       └── TurboModuleRegistry.getEnforcing<Spec>()
│
├── 🍎 iOS Implementation
│   ├── TurboModule Version
│   │   ├── DeviceInfoModule.h
│   │   └── DeviceInfoModule.mm
│   │       ├── Implements spec
│   │       ├── getTurboModule() method
│   │       └── Native iOS API calls
│   │
│   └── Legacy Version
│       ├── DeviceInfoModuleLegacy.h
│       └── DeviceInfoModuleLegacy.m
│           ├── RCT_EXPORT_MODULE()
│           ├── RCT_EXPORT_METHOD()
│           └── Native iOS API calls
│
├── 🤖 Android Implementation
│   ├── TurboModule Version
│   │   └── DeviceInfoModule.kt
│   │       ├── Extends NativeDeviceInfoModuleSpec
│   │       ├── Implements interface
│   │       └── Native Android API calls
│   │
│   └── Legacy Version
│       └── DeviceInfoModuleLegacy.kt
│           ├── Extends ReactContextBaseJavaModule
│           ├── @ReactMethod annotations
│           └── Native Android API calls
│
└── 🎨 UI Component
    └── src/tabs/DeviceInfoTab.tsx
        ├── Import both modules
        ├── Test both implementations
        ├── Measure performance
        └── Display comparison
```

## 🔄 Data Flow Example

### Device Info Module

```
User Clicks Button
       │
       ▼
┌──────────────────────────────┐
│  DeviceInfoTab Component     │
│  - testTurboModule()         │
│  - testLegacyModule()        │
└──────────────────────────────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
  Start Timer    Call TurboModule   Call Legacy
       │                 │                 │
       │          ┌──────┴──────┐   ┌─────┴─────┐
       │          │  JSI Call   │   │   Bridge  │
       │          └──────┬──────┘   └─────┬─────┘
       │                 │                 │
       │          ┌──────▼──────┐   ┌─────▼─────┐
       │          │ Native iOS/ │   │ Native iOS/│
       │          │  Android    │   │  Android  │
       │          └──────┬──────┘   └─────┬─────┘
       │                 │                 │
       │          ┌──────▼──────┐   ┌─────▼─────┐
       │          │   Result    │   │  Result   │
       │          └──────┬──────┘   └─────┬─────┘
       │                 │                 │
       ▼                 ▼                 ▼
   End Timer      Display Data     Display Data
       │                 │                 │
       └─────────────────┴─────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │ Performance Comparison │
            │  TurboModule: 5ms     │
            │  Legacy: 12ms         │
            │  Improvement: 58%     │
            └────────────────────────┘
```

## 🎯 Key Differences

| Aspect | TurboModule | Legacy Bridge |
|--------|-------------|---------------|
| **Communication** | Direct JSI | Async Bridge |
| **Type Safety** | ✅ Compile-time | ❌ Runtime only |
| **Serialization** | Efficient | JSON overhead |
| **Loading** | Lazy loaded | All at startup |
| **Performance** | ⚡ Fast | 🐌 Slower |
| **Synchronous Support** | ✅ Yes | ❌ No |
| **Memory** | Lower | Higher |

## 📦 Package Structure

```
TurboModules Package
├── MainApplication.kt (Android)
│   ├── TurboModulesPackage
│   │   ├── DeviceInfoModule
│   │   ├── BatteryStatusModule
│   │   ├── ClipboardModule
│   │   ├── NetworkInfoModule
│   │   └── CalculationModule
│   │
│   └── LegacyModulesPackage
│       ├── DeviceInfoModuleLegacy
│       ├── BatteryStatusModuleLegacy
│       ├── ClipboardModuleLegacy
│       ├── NetworkInfoModuleLegacy
│       └── CalculationModuleLegacy
│
└── AppDelegate.swift (iOS)
    └── Automatically registers modules
        via RCTCxxBridge
```

## 🔧 Build Process

```
npm run android / npm run ios
         │
         ▼
┌─────────────────────┐
│   React Native CLI  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Codegen Runs      │
│   - Reads TS specs  │
│   - Generates C++   │
│   - Generates JNI   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Native Build       │
│  - iOS: Xcode       │
│  - Android: Gradle  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Metro Bundler      │
│  - Bundles JS       │
│  - Hot reload       │
└─────────────────────┘
         │
         ▼
      App Running!
```

## 🎨 UI Layer Architecture

```
┌─────────────────────────────────────────────┐
│              Main App.tsx                   │
│  ┌─────────────────────────────────────┐   │
│  │         Tab Navigation              │   │
│  └─────────────────────────────────────┘   │
│           │    │    │    │    │            │
│           ▼    ▼    ▼    ▼    ▼            │
│  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐     │
│  │ Tab ││ Tab ││ Tab ││ Tab ││ Tab │     │
│  │  1  ││  2  ││  3  ││  4  ││  5  │     │
│  └─────┘└─────┘└─────┘└─────┘└─────┘     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │         Active Tab Content          │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │  Test Button                │   │   │
│  │  └─────────────────────────────┘   │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │  ✨ TurboModule Results     │   │   │
│  │  │  Green Border              │   │   │
│  │  │  Shows: Data + Time        │   │   │
│  │  └─────────────────────────────┘   │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │  🐌 Legacy Results          │   │   │
│  │  │  Orange Border             │   │   │
│  │  │  Shows: Data + Time        │   │   │
│  │  └─────────────────────────────┘   │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │  📊 Performance Comparison  │   │   │
│  │  │  Blue Border               │   │   │
│  │  │  Shows: % Improvement      │   │   │
│  │  └─────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

This architecture enables:
- ✅ Direct performance comparison
- ✅ Type-safe native modules
- ✅ Optimal performance
- ✅ Easy maintenance
- ✅ Scalable design
