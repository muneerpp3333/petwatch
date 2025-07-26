# PetWatch Backend API

GraphQL API backend for the PetWatch mobile application built with NestJS, TypeORM, and PostgreSQL.

## Getting Started

### Database Setup

```bash
# Start PostgreSQL database
docker-compose up -d

# Wait for database to be ready
```

### Backend Setup

```bash
# Install dependencies
cd backend
bun install  # or npm install

# Run the application in development mode
bun run start:dev  # or npm run start:dev

# Seed the database (in another terminal)
bun run seed  # or npm run seed
```

## GraphQL Playground

Access the GraphQL playground at: http://localhost:3000/graphql

## Available Queries

### Get all available pets
```graphql
query {
  availablePets {
    id
    name
    species
    breed
    age
    gender
    description
    imageUrl
    location
    adoptionFee
    vaccinated
    neutered
  }
}
```

### Get pet by ID
```graphql
query {
  pet(id: "1") {
    id
    name
    species
    breed
    age
    gender
    description
    imageUrl
    location
    adoptionFee
    vaccinated
    neutered
  }
}
```

## Available Mutations

### Create adoption request
```graphql
mutation {
  createAdoption(createAdoptionInput: {
    petId: "1"
    fullName: "John Doe"
    email: "john@example.com"
    phone: "+1234567890"
    street: "123 Main St"
    city: "San Francisco"
    state: "CA"
    zipCode: "94105"
  }) {
    id
    fullName
    email
    adoptionFee
    createdAt
    pet {
      name
      breed
    }
  }
}
```

### Process payment for adoption
```graphql
mutation {
  processPayment(id: "adoption-id") {
    id
    paymentStatus
  }
}
```

## Mobile App Integration

The mobile app should connect to the GraphQL endpoint at:
- Development: `http://localhost:3000/graphql`
- Production: Update with your production URL

### Required Changes in Mobile App

1. Install GraphQL client (Apollo Client recommended)
2. Replace local JSON data loading with GraphQL queries
3. Update the adoption flow to use the createAdoption mutation
4. Handle async data loading and error states

## Environment Variables

```
DATABASE_URL=postgresql://petwatch:petwatch123@localhost:5432/petwatch_db
NODE_ENV=development
PORT=3000
```

## Database Schema

- **pets**: Stores pet information
- **adoptions**: Stores adoption requests and payment status
- **users**: (Future) User authentication and profiles