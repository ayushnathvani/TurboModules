# TurboModules Performance Demo

A comprehensive React Native application demonstrating the performance benefits of TurboModules compared to legacy bridge modules.

## 🚀 Overview

This project showcases **TurboModules** - React Native's new native module system that provides significant performance improvements over the legacy bridge architecture. The app features 5 different native modules, each implemented in both TurboModule and legacy bridge versions to provide real-time performance comparisons.

## ✨ Features

The app includes 5 native module examples with performance benchmarks:

### 1. 📱 Device Info Module
- **Purpose**: Get device model, manufacturer, OS version, device ID, and brand
- **Performance**: Compare initialization and data retrieval times
- **Use Case**: Essential device information for analytics and diagnostics

### 2. 🔋 Battery Status Module
- **Purpose**: Query battery percentage, charging state, and charging type
- **Performance**: Benchmark real-time battery status queries
- **Use Case**: Power management and user experience optimization

### 3. 📋 Clipboard Module
- **Purpose**: Copy and paste text natively
- **Performance**: Measure clipboard operations (set/get)
- **Use Case**: Native clipboard integration for better UX

### 4. 📶 Network Info Module
- **Purpose**: Get current network type (WiFi, cellular, ethernet)
- **Performance**: Compare network status detection speeds
- **Use Case**: Adaptive content loading based on connectivity

### 5. ⚡ Custom Calculation Module
- **Purpose**: Run heavy calculations natively
- **Performance**: Demonstrate significant speedups for CPU-intensive tasks
- **Operations**:
  - Fibonacci sequence (40th number)
  - Prime factorization (123,456,789)
  - Matrix multiplication (100x100)
- **Use Case**: Offload heavy computations from JavaScript

## 🎨 UI Features

- **Tab-based Navigation**: Separate tab for each module example
- **Side-by-Side Comparison**: Visual comparison of TurboModule vs Legacy performance
- **Performance Metrics**: Real-time timing measurements in milliseconds
- **Performance Percentage**: Calculate and display speedup percentages
- **Color-Coded Results**: Green for TurboModules, Orange for legacy
- **Interactive Testing**: Test button to run both implementations simultaneously

## 🏗️ Architecture

### TurboModules
- **Location**: `src/specs/` - TypeScript specs
- **iOS**: `ios/TurboModules/` - Objective-C++/Swift implementations
- **Android**: `android/app/src/main/java/com/turbomodules/` - Kotlin implementations
- **Benefits**:
  - ✅ Type-safe interfaces
  - ✅ Lazy loading
  - ✅ Direct JSI integration
  - ✅ Synchronous calls support
  - ✅ Better performance

### Legacy Bridge Modules
- **Location**: `src/legacy/` - JavaScript wrappers
- **iOS**: Uses standard RCT_EXPORT_METHOD
- **Android**: `android/app/src/main/java/com/turbomodules/legacy/` - Legacy implementations
- **Characteristics**:
  - ⚠️ Runtime type checking
  - ⚠️ Bridge overhead
  - ⚠️ Async-only communication
  - ⚠️ JSON serialization overhead

## 📦 Project Structure

```
TurboModules/
├── src/
│   ├── App.tsx                 # Main app with tab navigation
│   ├── specs/                  # TurboModule TypeScript specs
│   │   ├── NativeDeviceInfoModule.ts
│   │   ├── NativeBatteryStatusModule.ts
│   │   ├── NativeClipboardModule.ts
│   │   ├── NativeNetworkInfoModule.ts
│   │   └── NativeCalculationModule.ts
│   ├── legacy/                 # Legacy bridge module wrappers
│   │   ├── DeviceInfoModuleLegacy.ts
│   │   ├── BatteryStatusModuleLegacy.ts
│   │   ├── ClipboardModuleLegacy.ts
│   │   ├── NetworkInfoModuleLegacy.ts
│   │   └── CalculationModuleLegacy.ts
│   └── tabs/                   # UI components for each module
│       ├── DeviceInfoTab.tsx
│       ├── BatteryStatusTab.tsx
│       ├── ClipboardTab.tsx
│       ├── NetworkInfoTab.tsx
│       └── CalculationTab.tsx
├── ios/
│   └── TurboModules/           # iOS TurboModule implementations
│       ├── DeviceInfoModule.h/mm
│       ├── BatteryStatusModule.h/mm
│       ├── ClipboardModule.h/mm
│       ├── NetworkInfoModule.h/mm
│       └── CalculationModule.h/mm
└── android/
    └── app/src/main/java/com/turbomodules/
        ├── DeviceInfoModule.kt
        ├── BatteryStatusModule.kt
        ├── ClipboardModule.kt
        ├── NetworkInfoModule.kt
        ├── CalculationModule.kt
        ├── TurboModulesPackage.kt
        └── legacy/             # Android legacy implementations
            ├── DeviceInfoModuleLegacy.kt
            ├── BatteryStatusModuleLegacy.kt
            ├── ClipboardModuleLegacy.kt
            ├── NetworkInfoModuleLegacy.kt
            ├── CalculationModuleLegacy.kt
            └── LegacyModulesPackage.kt
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and JDK

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install iOS dependencies** (macOS only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Run the app**:

   **For iOS**:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

   **For Android**:
   ```bash
   npm run android
   # or
   yarn android
   ```

## 📊 Performance Benchmarks

Expected performance improvements with TurboModules:

| Module | Operation | Improvement |
|--------|-----------|-------------|
| Device Info | Get device info | ~30-50% faster |
| Battery Status | Get battery status | ~30-40% faster |
| Clipboard | Set/Get operations | ~40-60% faster |
| Network Info | Get network status | ~30-50% faster |
| Calculation | Heavy computations | ~50-70% faster |

*Note: Actual results may vary based on device and platform*

## 🎯 Key Learnings

### Why TurboModules are Faster:

1. **Direct JSI Integration**: Bypasses the bridge for direct JavaScript-to-Native calls
2. **Type Safety**: Compile-time type checking reduces runtime overhead
3. **Lazy Loading**: Modules are loaded only when needed
4. **Efficient Serialization**: Direct memory access instead of JSON serialization
5. **Synchronous Support**: Can make synchronous calls when appropriate

### When to Use TurboModules:

- ✅ Performance-critical operations
- ✅ Frequent native-JS communication
- ✅ New native modules
- ✅ Type-safe native APIs
- ✅ Heavy computational tasks

## 🛠️ Development

### Adding a New Module

1. **Create TypeScript spec** in `src/specs/`
2. **Implement iOS version** in `ios/TurboModules/`
3. **Implement Android version** in `android/app/src/main/java/com/turbomodules/`
4. **Add to packages** (TurboModulesPackage)
5. **Create UI tab** in `src/tabs/`
6. **Update main App.tsx**

### Code Generation

React Native's codegen automatically generates native code from TypeScript specs:

```bash
# Codegen runs automatically during build, but you can trigger it manually:
npm run android  # Triggers codegen for Android
npm run ios      # Triggers codegen for iOS
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Resources

- [React Native TurboModules Documentation](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [JSI (JavaScript Interface)](https://reactnative.dev/architecture/glossary#javascript-interfaces-jsi)

## 👨‍💻 Author

Built with ❤️ to demonstrate the power of TurboModules

---

**Happy Coding! 🚀**
