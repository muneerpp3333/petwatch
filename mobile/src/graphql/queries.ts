import { gql } from '@apollo/client';

export const GET_PAGINATED_PETS = gql`
  query GetPaginatedPets($page: Int!, $limit: Int!) {
    paginatedPets(paginationArgs: { page: $page, limit: $limit }) {
      pets {
        id
        name
        species
        breed
        age
        gender
        description
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
`;

export const GET_PAGINATED_AVAILABLE_PETS = gql`
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
`;

export const GET_PET_BY_ID = gql`
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
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_PETS = gql`
  query GetAllPets {
    pets {
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
      adoptionStatus
    }
  }
`;

export const GET_AVAILABLE_PETS = gql`
  query GetAvailablePets {
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
      adoptionStatus
    }
  }
`;