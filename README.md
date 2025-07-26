# PetWatch - Pet Adoption App

A full-stack pet adoption application built with React Native, NestJS, PostgreSQL, and GraphQL.

## Features

- 📱 Browse available pets for adoption
- 🐾 View detailed pet information
- 💳 Mock adoption and payment process
- 📍 Location services to show user coordinates
- 🎨 Beautiful UI with Tamagui components
- 🚀 GraphQL API with real-time updates

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- GraphQL (Apollo Server)
- TypeORM
- Docker

### Mobile
- React Native (bare workflow)
- Tamagui UI
- Apollo Client
- React Navigation
- Geolocation services

## Project Structure

```
petwatch/
├── backend/          # NestJS backend API
├── mobile/           # React Native mobile app
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- React Native development environment set up
- Xcode (for iOS) or Android Studio (for Android)

### Backend Setup

1. Start the backend services:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- NestJS backend on port 3000

2. The GraphQL playground will be available at: http://localhost:3000/graphql

### Mobile Setup

1. Install dependencies:
```bash
cd mobile
npm install
```

2. iOS setup:
```bash
cd ios
pod install
cd ..
```

3. Run the app:
```bash
# iOS
npm run ios

# Android
npm run android
```

## API Endpoints

GraphQL endpoint: `http://localhost:3000/graphql`

### Queries
- `availablePets` - Get all available pets
- `pet(id)` - Get a specific pet by ID
- `adoptions` - Get all adoptions

### Mutations
- `createPet` - Add a new pet
- `updatePet` - Update pet information
- `createAdoption` - Start adoption process
- `processPayment` - Complete adoption payment

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Development/production mode

### Mobile
- Update `src/services/apollo.ts` with your backend URL

## Features Implemented

✅ Pet listing with images and details
✅ Pet details view
✅ Adoption form
✅ Mock payment processing
✅ Location services
✅ Responsive UI with Tamagui
✅ GraphQL integration
✅ Docker setup

## Screenshots

(Add screenshots here)

## License

MIT# petwatch
