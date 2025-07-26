# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# For iOS, first install CocoaPods dependencies
cd ios && pod install && cd ..
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Run tests
npm test
```

## Architecture Overview

This is a React Native pet adoption mobile app built with TypeScript. The architecture follows a screen-based navigation pattern:

- **Navigation**: React Navigation v7 with stack navigator
- **Entry Point**: `App.tsx` sets up navigation container with 4 screens
- **Screens**: Located in `src/screens/`, each handles a specific feature:
  - `pet-list-screen.tsx`: Main grid display of available pets
  - `pet-details-screen.tsx`: Individual pet information with adoption action
  - `adoption-payment-screen.tsx`: Mock payment flow for pet adoption
  - `location-screen.tsx`: User location display using device GPS

- **Components**: `src/components/location-button.tsx` provides location access from header
- **Data**: Mock pet data stored in `src/data/pets.json`

## Key Dependencies

- **react-native**: 0.80.2
- **@react-navigation/native & stack**: For app navigation
- **react-native-gesture-handler**: Required for navigation gestures
- **react-native-get-location**: For accessing device location
- **react-native-screens**: Native navigation optimization

## Platform-Specific Notes

### iOS
- Requires CocoaPods installation before building
- Must run `bundle install` for first-time setup
- Use `bundle exec pod install` when updating native dependencies

### Android
- Debug keystore included for development builds
- Release builds: `cd android && ./gradlew assembleRelease`

## TypeScript Configuration
Uses `@react-native/typescript-config` preset for standard React Native TypeScript settings.