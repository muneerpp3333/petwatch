import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Config from 'react-native-config';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        paginatedPets: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              pets: [...(existing.pets || []), ...incoming.pets],
            };
          },
        },
        paginatedAvailablePets: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              pets: [...(existing.pets || []), ...incoming.pets],
            };
          },
        },
      },
    },
  },
});

let apolloClient: ApolloClient<any> | null = null;

export const getApolloClient = async () => {
  if (apolloClient) {
    return apolloClient;
  }

  const httpLink = createHttpLink({
    uri: Config.API_URL || 'http://localhost:3000/graphql',
  });

  apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });

  return apolloClient;
};

export const resetApolloClient = () => {
  if (apolloClient) {
    apolloClient.clearStore();
    apolloClient = null;
  }
};