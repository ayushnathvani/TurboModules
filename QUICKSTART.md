# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ React Native CLI installed globally
- ✅ For iOS: macOS, Xcode, CocoaPods
- ✅ For Android: JDK 11+, Android Studio, ANDROID_HOME set

## 1️⃣ Quick Start (Automated)

Run the automated setup script:

```bash
chmod +x quick-start.sh
./quick-start.sh
```

Follow the prompts to set up iOS, Android, or both.

## 2️⃣ Manual Setup

### Install Dependencies

```bash
npm install
# or
yarn install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

**Important**: You must add the native module files to Xcode:

1. Open `ios/TurboModules.xcworkspace`
2. Right-click on "TurboModules" folder in Xcode
3. Select "Add Files to TurboModules..."
4. Navigate to `ios/TurboModules/`
5. Select ALL `.h`, `.m`, and `.mm` files
6. Uncheck "Copy items if needed"
7. Click "Add"

### Android Setup

Android files are already in place. Just ensure:

1. ANDROID_HOME is set
2. An emulator is running or device is connected

## 3️⃣ Run the App

### iOS

```bash
npm run ios
# or
yarn ios

# For specific simulator:
npx react-native run-ios --simulator="iPhone 15"
```

### Android

```bash
npm run android
# or
yarn android

# For specific device:
adb devices  # List devices
npx react-native run-android --deviceId=<device-id>
```

## 4️⃣ Using the App

Once running:

1. **Select a Tab**: Choose from Device Info, Battery, Clipboard, Network, or Calculation
2. **Run Test**: Tap "Test Both Implementations" button
3. **Compare Results**: 
   - Green card = TurboModule (faster ⚡)
   - Orange card = Legacy Bridge (slower 🐌)
   - Blue card = Performance comparison
4. **Check Timing**: See millisecond measurements and percentage improvements

## 🎯 What You'll See

### Device Info Tab
- Device model, manufacturer, OS version
- Performance: ~30-50% faster with TurboModules

### Battery Status Tab
- Battery level, charging state, charging type
- Performance: ~30-40% faster with TurboModules

### Clipboard Tab
- Copy and paste text operations
- Performance: ~40-60% faster with TurboModules

### Network Info Tab
- Network type (WiFi/cellular), connection status
- Performance: ~30-50% faster with TurboModules

### Calculation Tab
- Three test options: Fibonacci, Prime Factors, Matrix Multiplication
- Performance: ~50-70% faster with TurboModules
- Shows most dramatic performance improvements!

## 🔧 Troubleshooting

### Common Issues

**Metro Bundler Issues**:
```bash
npm start -- --reset-cache
```

**iOS Build Errors**:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android Build Errors**:
```bash
cd android
./gradlew clean
cd ..
```

**Module Not Found**:
- iOS: Check files are added to Xcode project
- Android: Sync Gradle files in Android Studio

### Platform-Specific Issues

**iOS Simulator Battery**:
- Battery status may show dummy data
- Test on real device for accurate results

**Android Permissions**:
- Grant necessary permissions manually if needed
- Check Settings → Apps → TurboModules → Permissions

## 📊 Performance Tips

1. **Test on Real Devices**: Simulators may not show accurate performance
2. **Multiple Runs**: Run tests multiple times for consistent results
3. **Background Apps**: Close other apps for accurate benchmarks
4. **Calculation Module**: Shows most dramatic improvements

## 📚 Next Steps

1. ✅ Explore each tab and test all modules
2. ✅ Compare performance metrics
3. ✅ Read `TURBOMODULES_README.md` for detailed info
4. ✅ Check `ARCHITECTURE.md` for technical details
5. ✅ Modify calculation parameters to see different results
6. ✅ Add your own custom modules!

## 🎓 Learning Path

1. **Start with Device Info**: Simplest module
2. **Try Clipboard**: Interactive and practical
3. **Test Calculations**: Most dramatic performance gains
4. **Explore Code**: Check TypeScript specs and native implementations
5. **Modify**: Change parameters, add features

## 🤝 Contributing

Want to add more modules or improve the project?

1. Fork the repository
2. Create your feature branch
3. Follow the existing patterns
4. Test on both iOS and Android
5. Submit a pull request

## 📞 Need Help?

- Check `SETUP_GUIDE.md` for detailed setup instructions
- Review `TURBOMODULES_README.md` for architecture overview
- See `ARCHITECTURE.md` for technical diagrams
- Check React Native documentation

## 🎉 Success!

You should now see:
- 5 tabs in the app
- Working TurboModule and Legacy implementations
- Performance comparisons showing TurboModules are faster
- Real-time timing measurements

**Congratulations!** You're now exploring the power of TurboModules! 🚀

---

**Pro Tip**: The Calculation tab shows the most dramatic performance improvements. Try different operations to see how TurboModules excel at CPU-intensive tasks!
