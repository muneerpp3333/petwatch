# PetWatch 🐾

A full-stack pet adoption platform that connects loving pets with caring families. Built with React Native for mobile and NestJS/GraphQL for the backend.

## Features

- 📱 **Cross-platform mobile app** (iOS & Android)
- 🔍 **Browse available pets** with detailed profiles
- 🖼️ **Image galleries** for each pet
- 📍 **Location services** with Google Maps integration
- 💳 **Adoption workflow** with payment processing
- 🔄 **Real-time data synchronization** via GraphQL
- 📄 **Pagination support** for efficient browsing
- ✨ **Shimmer loading effects** for better UX
- 🔌 **Offline mode** with dummy data fallback

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **GraphQL** - API query language
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Relational database
- **Docker** - Containerization

### Mobile
- **React Native** - Cross-platform mobile framework
- **Apollo Client** - GraphQL client with caching
- **React Navigation** - Routing and navigation
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js >= 18
- [Bun](https://bun.sh) package manager
- Docker and Docker Compose
- Xcode (for iOS development)
- Android Studio (for Android development)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/petwatch.git
cd petwatch
```

### 2. Backend Setup

#### Start PostgreSQL database
```bash
docker-compose up -d
```

#### Install dependencies
```bash
cd backend
bun install
```

#### Run database migrations
The database schema will be automatically synchronized when you start the server.

#### Seed initial data
```bash
bun run seed
```

#### Start the development server
```bash
bun run start:dev
```

The GraphQL playground will be available at `http://localhost:3000/graphql`

### 3. Mobile App Setup

#### Install dependencies
```bash
cd mobile
bun install
```

#### iOS Setup
```bash
cd ios
bundle install  # First time only
bundle exec pod install
cd ..
```

#### Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```env
# Google Maps API Key (required for location features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL (optional - uses dummy data if not set)
API_URL=http://localhost:3000/graphql
```

#### Start Metro bundler
```bash
bun start
```

#### Run the app

**iOS:**
```bash
bun ios
```

**Android:**
```bash
bun android
```

## Environment Variables

### Backend
The backend uses the following database configuration (defined in docker-compose.yml):
- `POSTGRES_USER`: petwatch
- `POSTGRES_PASSWORD`: petwatch123
- `POSTGRES_DB`: petwatch_db

### Mobile
- `GOOGLE_MAPS_API_KEY`: Required for location services. Get one from [Google Cloud Console](https://console.cloud.google.com/)
- `API_URL`: Backend GraphQL endpoint. If not set, the app uses dummy data

## Development

### Backend Commands
```bash
bun run start          # Start server
bun run start:dev      # Start in watch mode
bun run build          # Build for production
bun run test           # Run tests
bun run lint           # Lint code
bun run seed           # Seed database with sample data
```

### Mobile Commands
```bash
bun start              # Start Metro bundler
bun ios                # Run on iOS simulator
bun android            # Run on Android emulator
bun test               # Run tests
bun lint               # Lint code
```

## API Documentation

### GraphQL Endpoint
```
http://localhost:3000/graphql
```

### Key Queries

#### Get paginated available pets
```graphql
query GetPaginatedAvailablePets($page: Int!, $limit: Int!) {
  paginatedAvailablePets(paginationArgs: { page: $page, limit: $limit }) {
    pets {
      id
      name
      species
      breed
      age
      gender
      description
      imageUrl
      images
      location
      adoptionFee
      vaccinated
      neutered
      adoptionStatus
    }
    totalCount
    page
    limit
    hasNextPage
    totalPages
  }
}
```

#### Get pet by ID
```graphql
query GetPetById($id: ID!) {
  pet(id: $id) {
    id
    name
    species
    breed
    age
    gender
    description
    imageUrl
    images
    location
    adoptionFee
    vaccinated
    neutered
    adoptionStatus
  }
}
```

### Key Mutations

#### Create adoption
```graphql
mutation CreateAdoption($input: CreateAdoptionInput!) {
  createAdoption(createAdoptionInput: $input) {
    id
    fullName
    email
    phone
    street
    city
    state
    zipCode
    adoptionFee
    paymentStatus
    pet {
      id
      name
    }
  }
}
```

## Project Structure

```
petwatch/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── adoptions/      # Adoption module
│   │   ├── pets/           # Pets module
│   │   ├── users/          # Users module
│   │   └── main.ts         # Application entry point
│   └── package.json
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── apollo/         # Apollo Client configuration
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── graphql/        # GraphQL queries
│   │   ├── screens/        # App screens
│   │   └── services/       # Utility services
│   ├── ios/                # iOS-specific files
│   ├── android/            # Android-specific files
│   └── package.json
└── docker-compose.yml      # Database configuration
```

## Troubleshooting

### iOS Build Issues

#### Pod installation fails
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install --repo-update
```

#### Build fails with "No bundle URL present"
```bash
cd mobile
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle
```

### Android Build Issues

#### Metro bundler connection issues
Make sure your device/emulator can reach your development machine:
```bash
adb reverse tcp:8081 tcp:8081
```

#### Build fails with "Could not connect to development server"
1. Check Metro is running: `bun start`
2. Clear cache: `bun start -- --reset-cache`

### Backend Issues

#### Database connection fails
1. Ensure Docker is running
2. Check PostgreSQL container: `docker ps`
3. Restart containers: `docker-compose restart`

#### GraphQL schema not updating
```bash
rm -rf dist
bun run build
bun run start:dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pet images from [Unsplash](https://unsplash.com)
- Icons and design inspiration from the React Native community