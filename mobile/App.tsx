import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import LocationButton from './src/components/location-button';
import PetListScreen from './src/screens/pet-list-screen';
import PetDetailsScreen from './src/screens/pet-details-screen';
import AdoptionPaymentScreen from './src/screens/adoption-payment-screen';
import LocationScreen from './src/screens/location-screen';
import { AdoptionProvider } from './src/contexts/AdoptionContext';
import { getApolloClient } from './src/apollo/client';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

// Extract header right function outside of render
const createHeaderRight = (navigation: any) => () =>
  <LocationButton navigation={navigation} />;

function App() {
  const [apolloClient, setApolloClient] = useState<ApolloClient<any> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApollo = async () => {
      try {
        const client = await getApolloClient();
        setApolloClient(client);
      } catch (error) {
        console.error('Failed to initialize Apollo Client:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApollo();
  }, []);

  if (isInitializing || !apolloClient) {
    // You could return a splash screen here
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AdoptionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="PetList"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="PetList"
              component={PetListScreen}
              options={({ navigation }) => ({
                title: 'PetWatch',
                headerRight: createHeaderRight(navigation),
              })}
            />
            <Stack.Screen
              name="PetDetails"
              component={PetDetailsScreen}
              options={{
                title: 'Pet Details',
                headerBackTitle: undefined,
              }}
            />
            <Stack.Screen
              name="AdoptionPayment"
              component={AdoptionPaymentScreen}
              options={{
                title: 'Complete Adoption',
                headerBackTitle: undefined,
              }}
            />
            <Stack.Screen
              name="Location"
              component={LocationScreen}
              options={{
                title: 'Your Location',
                headerBackTitle: undefined,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AdoptionProvider>
    </ApolloProvider>
  );
}

export default App;