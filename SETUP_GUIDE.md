# TurboModules Setup & Build Instructions

## 🔧 Prerequisites

Before building the project, ensure you have:

- **Node.js** >= 18
- **npm** or **yarn**
- **React Native CLI**
- **Xcode** (for iOS, macOS only) - Latest version recommended
- **CocoaPods** (for iOS)
- **Android Studio** (for Android)
- **JDK** 11 or higher

## 📱 iOS Setup

### 1. Install Dependencies

```bash
# Install JavaScript dependencies
npm install
# or
yarn install

# Install iOS pods
cd ios
pod install
cd ..
```

### 2. Add Files to Xcode Project

The following files need to be added to your Xcode project:

**TurboModule Files:**
- `ios/TurboModules/DeviceInfoModule.h`
- `ios/TurboModules/DeviceInfoModule.mm`
- `ios/TurboModules/BatteryStatusModule.h`
- `ios/TurboModules/BatteryStatusModule.mm`
- `ios/TurboModules/ClipboardModule.h`
- `ios/TurboModules/ClipboardModule.mm`
- `ios/TurboModules/NetworkInfoModule.h`
- `ios/TurboModules/NetworkInfoModule.mm`
- `ios/TurboModules/CalculationModule.h`
- `ios/TurboModules/CalculationModule.mm`

**Legacy Module Files:**
- `ios/TurboModules/DeviceInfoModuleLegacy.h`
- `ios/TurboModules/DeviceInfoModuleLegacy.m`
- `ios/TurboModules/BatteryStatusModuleLegacy.h`
- `ios/TurboModules/BatteryStatusModuleLegacy.m`
- `ios/TurboModules/ClipboardModuleLegacy.h`
- `ios/TurboModules/ClipboardModuleLegacy.m`
- `ios/TurboModules/NetworkInfoModuleLegacy.h`
- `ios/TurboModules/NetworkInfoModuleLegacy.m`
- `ios/TurboModules/CalculationModuleLegacy.h`
- `ios/TurboModules/CalculationModuleLegacy.m`

**Steps to add files:**
1. Open `ios/TurboModules.xcworkspace` in Xcode
2. Right-click on the `TurboModules` folder
3. Select "Add Files to TurboModules..."
4. Navigate to `ios/TurboModules/` and select all the module files
5. Make sure "Copy items if needed" is **unchecked**
6. Make sure "Create groups" is selected
7. Make sure your target is checked
8. Click "Add"

### 3. Update Build Settings (If Needed)

In Xcode:
1. Select your project in the navigator
2. Select your target
3. Go to "Build Settings"
4. Search for "C++ Language Dialect"
5. Set to "C++17" or higher
6. Search for "Enable Modules (C and Objective-C)"
7. Set to "Yes"

### 4. Run the App

```bash
npm run ios
# or
yarn ios

# To run on a specific simulator
npx react-native run-ios --simulator="iPhone 15"
```

## 🤖 Android Setup

### 1. Install Dependencies

```bash
# Install JavaScript dependencies
npm install
# or
yarn install
```

### 2. Verify Android Files

All Android files should already be in place:

**TurboModule Files:**
- `android/app/src/main/java/com/turbomodules/DeviceInfoModule.kt`
- `android/app/src/main/java/com/turbomodules/BatteryStatusModule.kt`
- `android/app/src/main/java/com/turbomodules/ClipboardModule.kt`
- `android/app/src/main/java/com/turbomodules/NetworkInfoModule.kt`
- `android/app/src/main/java/com/turbomodules/CalculationModule.kt`
- `android/app/src/main/java/com/turbomodules/TurboModulesPackage.kt`

**Legacy Module Files:**
- `android/app/src/main/java/com/turbomodules/legacy/DeviceInfoModuleLegacy.kt`
- `android/app/src/main/java/com/turbomodules/legacy/BatteryStatusModuleLegacy.kt`
- `android/app/src/main/java/com/turbomodules/legacy/ClipboardModuleLegacy.kt`
- `android/app/src/main/java/com/turbomodules/legacy/NetworkInfoModuleLegacy.kt`
- `android/app/src/main/java/com/turbomodules/legacy/CalculationModuleLegacy.kt`
- `android/app/src/main/java/com/turbomodules/legacy/LegacyModulesPackage.kt`

### 3. Update build.gradle (If Needed)

The `android/app/build.gradle` should have codegen enabled (this is usually done automatically in React Native 0.80+).

### 4. Add Permissions

Add these permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.BATTERY_STATS" />
```

### 5. Run the App

```bash
npm run android
# or
yarn android

# To run on a specific device/emulator
npx react-native run-android --deviceId=<device-id>
```

## 🔄 Codegen

React Native's codegen automatically generates native code from TypeScript specs during the build process.

### Manual Codegen Trigger (Optional)

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# For iOS
cd ios
pod install
cd ..

# Run the app (this triggers codegen)
npm run android  # or npm run ios
```

## 🐛 Troubleshooting

### iOS Issues

**Problem: Module not found errors**
- Solution: Make sure all `.h` and `.mm`/`.m` files are added to Xcode project
- Clean build folder: Product → Clean Build Folder (Cmd + Shift + K)
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/`

**Problem: Compilation errors**
- Solution: Check C++ Language Dialect is set to C++17 or higher
- Make sure React-Codegen is properly installed via CocoaPods

**Problem: Linker errors**
- Solution: Run `cd ios && pod install && cd ..`
- Clean and rebuild

### Android Issues

**Problem: Cannot resolve symbol**
- Solution: Sync Gradle files
- Invalidate caches: File → Invalidate Caches / Restart in Android Studio
- Run `cd android && ./gradlew clean && cd ..`

**Problem: Codegen not generating files**
- Solution: Make sure `codegenConfig` is in `package.json`
- Delete `android/app/build` folder
- Rebuild the app

**Problem: Permission denied errors**
- Solution: Add required permissions to AndroidManifest.xml
- Check that permissions are granted on device

### Common Issues (Both Platforms)

**Problem: Metro bundler issues**
- Solution: Clear Metro cache:
  ```bash
  npm start -- --reset-cache
  # or
  yarn start --reset-cache
  ```

**Problem: JavaScript errors**
- Solution: Check that all imports are correct
- Make sure TypeScript files are properly compiled
- Restart the Metro bundler

## 📊 Verifying Installation

Once the app is running:

1. You should see a tab bar with 5 tabs:
   - Device Info
   - Battery
   Clipboard
   - Network
   - Calculation

2. Click on each tab and press the "Test Both Implementations" button

3. You should see:
   - Data from both TurboModule and Legacy implementations
   - Timing information for each call
   - Performance comparison showing TurboModules are faster

## 🎯 Expected Output

Each tab should display:
- ✨ **With TurboModule** section (green border) with timing
- 🐌 **Without TurboModule** section (orange border) with timing
- 📊 **Performance Comparison** section showing percentage improvement

## 📝 Notes

- **New Architecture**: This project uses TurboModules which are part of React Native's New Architecture
- **Type Safety**: TurboModules provide compile-time type checking
- **Performance**: You should see 30-70% performance improvements depending on the operation
- **Compatibility**: Requires React Native 0.68+ (this project uses 0.80.2)

## 🚀 Next Steps

1. Test all tabs to verify functionality
2. Compare performance metrics
3. Modify the calculation parameters to see different performance profiles
4. Add your own custom TurboModules following the same pattern

## 📚 Additional Resources

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [TurboModules Documentation](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [Codegen Documentation](https://reactnative.dev/docs/the-new-architecture/pillars-codegen)

---

**Need Help?** Check the main README or create an issue on the repository.
