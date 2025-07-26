# PetWatch Mobile App

A React Native application for pet adoption that displays available pets, allows viewing details, and simulates an adoption process with location features.

## Features Implemented

✅ **Pet List Display** - Shows available pets from local JSON data
✅ **Pet Details View** - Tap any pet to view detailed information
✅ **Adoption Process** - Mock payment screen to simulate adoption
✅ **Location Feature** - Shows user's current coordinates
✅ **Navigation** - Smooth navigation between all screens

## Project Structure

```
mobile/
├── src/
│   ├── data/
│   │   └── pets.json          # Mock pet data
│   └── screens/
│       ├── PetListScreen.tsx       # Main pet listing
│       ├── PetDetailsScreen.tsx    # Individual pet details
│       ├── AdoptionPaymentScreen.tsx # Mock payment flow
│       └── LocationScreen.tsx      # User location display
├── App.tsx                    # Main app with navigation
└── package.json              # Dependencies
```

## Prerequisites

- Node.js >= 18
- For iOS: macOS with Xcode installed
- For Android: Android Studio with Android SDK

## Installation

1. Install dependencies:
```bash
cd mobile
npm install
```

2. For iOS (on macOS):
```bash
cd ios
pod install --repo-update
cd ..
```

If you encounter pod issues, try:
```bash
cd ios
pod repo update
pod install
cd ..
```

## Running the App

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

## Building for Release

### Android APK

1. Generate a release APK:
```bash
cd android
./gradlew assembleRelease
```

2. The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build

1. Open the project in Xcode:
```bash
cd ios
open petwatch.xcworkspace
```

2. Select your development team in project settings
3. Choose "Generic iOS Device" as the build target
4. Select Product → Archive from the menu
5. Once archived, you can export the IPA file

## Screenshots

The app includes the following screens:

1. **Pet List** - Grid view of available pets with photos and basic info
2. **Pet Details** - Full pet information with adoption button
3. **Adoption Payment** - Form to complete the adoption process
4. **Location Screen** - Shows current user coordinates

## Technical Details

- **Framework**: React Native 0.80.2
- **Navigation**: React Navigation v7
- **Location**: react-native-get-location
- **Styling**: React Native StyleSheet
- **TypeScript**: Full type safety

## Notes

- Location permissions are required for the location feature
- Pet images are loaded from URLs (requires internet connection)
- Payment processing is simulated - no real transactions occur
- The app uses mock data from pets.json file

## Troubleshooting

If you encounter build issues:

1. Clear caches:
```bash
npx react-native start --reset-cache
cd android && ./gradlew clean
cd ios && rm -rf build/
```

2. Reinstall node_modules:
```bash
rm -rf node_modules
npm install
```

3. For iOS pod issues:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```