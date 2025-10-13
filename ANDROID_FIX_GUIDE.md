# 🔧 Android TurboModules Build Fix Guide

## ❌ Error You're Seeing

```
Invariant Violation: TurboModuleRegistry.getEnforcing(): 
'DeviceInfoModule' could not be found.
```

## 🎯 Root Cause

The native Android modules aren't being properly registered or the codegen hasn't run properly for TurboModules.

## ✅ Solution Steps

### Step 1: Clean Everything

```bash
cd android
./gradlew clean
cd ..
```

### Step 2: Ensure Codegen Config is Correct

Check `package.json` has this config:

```json
"codegenConfig": {
  "name": "TurboModulesSpec",
  "type": "modules",
  "jsSrcsDir": "src/specs"
}
```

### Step 3: Rebuild with Codegen

```bash
# Clear Metro cache
npm start -- --reset-cache

# In a new terminal, rebuild Android
cd android
./gradlew clean
cd ..
npm run android
```

### Step 4: Check Android Build Files

Make sure `android/app/build.gradle` has React Native codegen enabled (it should by default in RN 0.80+).

### Step 5: Verify Module Registration

Check that `MainApplication.kt` includes:

```kotlin
import com.turbomodules.TurboModulesPackage
import com.turbomodules.legacy.LegacyModulesPackage

// In getPackages():
add(TurboModulesPackage())
add(LegacyModulesPackage())
```

## 🐛 Alternative: Use Mock Modules Temporarily

If you want to see the UI working while fixing the native code, you can temporarily use JavaScript-only implementations:

1. The mock files have been created in `src/modules/`
2. Update the tab files to import from mocks instead of specs
3. This lets you test the UI without native code

## 🔍 Debug Commands

```bash
# Check if module files are in the right place
ls android/app/src/main/java/com/turbomodules/

# Should show:
# - DeviceInfoModule.kt
# - BatteryStatusModule.kt
# - etc.

# Check generated code
ls android/app/build/generated/source/codegen/

# Rebuild from scratch
cd android
./gradlew clean assembleDebug --stacktrace
```

## 📱 Common Issues

### Issue 1: Codegen Not Running
**Solution**: Make sure `package.json` has the `codegenConfig` section.

### Issue 2: Module Files Not Found
**Solution**: Check that all `.kt` files are in the correct package structure.

### Issue 3: Package Not Registered
**Solution**: Verify `MainApplication.kt` has the packages added.

### Issue 4: Cache Issues
**Solution**: 
```bash
rm -rf android/app/build
npm start -- --reset-cache
```

## 🎯 Quick Fix for Demo

If you just want to see the app working for demonstration:

1. I've created mock modules that work purely in JavaScript
2. These won't show the performance difference but will let you see the UI
3. Once native modules are working, switch back to the TurboModule imports

## ⚡ Expected Behavior When Fixed

When working correctly, you should see:
- App launches without errors
- All 5 tabs are accessible
- TurboModule and Legacy both return real data
- Performance metrics show TurboModules are faster

## 🆘 Still Having Issues?

Try this complete rebuild:

```bash
# Complete clean
rm -rf node_modules
rm -rf android/app/build
rm -rf android/build
rm package-lock.json

# Reinstall
npm install

# Clean Android
cd android
./gradlew clean
cd ..

# Start fresh
npm start -- --reset-cache

# In new terminal
npm run android
```

## 📚 References

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [TurboModules Documentation](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [Codegen](https://reactnative.dev/docs/the-new-architecture/pillars-codegen)
