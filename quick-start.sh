#!/bin/bash

# TurboModules Quick Start Script
# This script helps you get started with the TurboModules demo project

echo "🚀 TurboModules Demo - Quick Start"
echo "=================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js $node_version installed"
else
    echo "❌ Node.js not found. Please install Node.js >= 18"
    exit 1
fi

# Install JavaScript dependencies
echo ""
echo "📥 Installing JavaScript dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -eq 0 ]; then
    echo "✅ JavaScript dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Platform selection
echo ""
echo "📱 Which platform do you want to run?"
echo "1) iOS (macOS only)"
echo "2) Android"
echo "3) Both"
read -p "Enter your choice (1-3): " platform_choice

# iOS setup
if [ "$platform_choice" = "1" ] || [ "$platform_choice" = "3" ]; then
    if [ "$(uname)" = "Darwin" ]; then
        echo ""
        echo "🍎 Setting up iOS..."
        
        # Check if CocoaPods is installed
        if command -v pod &> /dev/null; then
            echo "✅ CocoaPods found"
            echo "📥 Installing iOS dependencies..."
            cd ios
            pod install
            cd ..
            
            if [ $? -eq 0 ]; then
                echo "✅ iOS dependencies installed"
            else
                echo "⚠️  CocoaPods install failed. Please run 'cd ios && pod install' manually"
            fi
        else
            echo "⚠️  CocoaPods not found. Installing..."
            sudo gem install cocoapods
            cd ios
            pod install
            cd ..
        fi
    else
        echo "⚠️  iOS development is only available on macOS"
    fi
fi

# Android setup check
if [ "$platform_choice" = "2" ] || [ "$platform_choice" = "3" ]; then
    echo ""
    echo "🤖 Setting up Android..."
    
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  ANDROID_HOME environment variable not set"
        echo "   Please set up Android Studio and ANDROID_HOME"
    else
        echo "✅ ANDROID_HOME found: $ANDROID_HOME"
    fi
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""

if [ "$platform_choice" = "1" ]; then
    echo "To run on iOS:"
    echo "  npm run ios"
    echo ""
    echo "⚠️  IMPORTANT: Before running, you need to add the module files to Xcode:"
    echo "  1. Open ios/TurboModules.xcworkspace in Xcode"
    echo "  2. Add all .h, .m, and .mm files from ios/TurboModules/ to the project"
    echo "  3. See SETUP_GUIDE.md for detailed instructions"
elif [ "$platform_choice" = "2" ]; then
    echo "To run on Android:"
    echo "  npm run android"
    echo ""
    echo "Make sure you have:"
    echo "  • An Android emulator running, or"
    echo "  • A physical device connected via USB with USB debugging enabled"
else
    echo "To run on iOS:"
    echo "  npm run ios"
    echo ""
    echo "To run on Android:"
    echo "  npm run android"
    echo ""
    echo "⚠️  For iOS: Add module files to Xcode (see SETUP_GUIDE.md)"
fi

echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - SETUP_GUIDE.md"
echo "   - TURBOMODULES_README.md"
echo ""
echo "🎉 Happy coding!"
