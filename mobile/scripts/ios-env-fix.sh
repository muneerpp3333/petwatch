#!/bin/bash

# This script helps fix iOS environment variable issues
# Run this after changing .env file

echo "Fixing iOS environment setup..."

# Clean build artifacts
cd ios
rm -rf build/
rm -rf ~/Library/Developer/Xcode/DerivedData/petwatch-*

# Reinstall pods
pod deintegrate
pod install

echo "iOS environment fix complete!"
echo "Now rebuild the app in Xcode or run: npm run ios"