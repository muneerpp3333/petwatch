import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_PAGINATED_AVAILABLE_PETS } from '../graphql/queries';
import petsData from '../data/pets.json';
import Config from 'react-native-config';
import PetCardSkeleton from '../components/pet-card-skeleton';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

interface Pet {
  id: number | string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  images: string[];
  location: string;
  adoptionFee: number;
  vaccinated: boolean;
  neutered: boolean;
}

interface PetListScreenProps {
  navigation: any;
}

const ITEMS_PER_PAGE = 10;

const PetListScreen: React.FC<PetListScreenProps> = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_PAGINATED_AVAILABLE_PETS,
    {
      variables: { page: 1, limit: ITEMS_PER_PAGE },
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
    },
  );

  useEffect(() => {
    if (data?.paginatedAvailablePets?.pets) {
      setAllPets(data.paginatedAvailablePets.pets);
      setHasMoreData(data.paginatedAvailablePets.hasNextPage);
      setIsUsingDummyData(false);
    } else if (error && !Config.API_URL) {
      // Fallback to dummy data if no API URL is configured
      setAllPets(petsData);
      setIsUsingDummyData(true);
      setHasMoreData(false);
    }
  }, [data, error]);

  const loadMorePets = async () => {
    if (!hasMoreData || isLoadingMore || loading || isUsingDummyData) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await fetchMore({
        variables: { page: nextPage, limit: ITEMS_PER_PAGE },
      });

      if (result.data?.paginatedAvailablePets) {
        setPage(nextPage);
        setHasMoreData(result.data.paginatedAvailablePets.hasNextPage);
      }
    } catch (err) {
      console.error('Error loading more pets:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setPage(1);
    setAllPets([]);
    try {
      await refetch({ page: 1, limit: ITEMS_PER_PAGE });
    } catch (err) {
      console.error('Error refreshing pets:', err);
    }
  };

  const renderPetItem = ({ item }: { item: Pet }) => {
    const imageKey = item.id.toString();
    const isImageLoading = imageLoadingStates[imageKey] !== false;

    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => navigation.navigate('PetDetails', { pet: item })}
      >
        <View>
          {isImageLoading && (
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={[styles.petImage, styles.imagePlaceholder]}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
          )}
          <Image
            source={{
              uri: item.images?.[0] || 'https://via.placeholder.com/400x300',
            }}
            style={[styles.petImage, isImageLoading && styles.hiddenImage]}
            onLoadStart={() => {
              setImageLoadingStates(prev => ({ ...prev, [imageKey]: true }));
            }}
            onLoadEnd={() => {
              setImageLoadingStates(prev => ({ ...prev, [imageKey]: false }));
            }}
          />
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{item.name || 'Unnamed Pet'}</Text>
          {item.breed && item.age && (
            <Text style={styles.petDetails}>
              {item.breed} • {item.age} {item.age === 1 ? 'year' : 'years'} old
            </Text>
          )}
          {item.location && (
            <Text style={styles.petLocation}>{item.location}</Text>
          )}
          {item.adoptionFee && (
            <Text style={styles.adoptionFee}>
              ${item.adoptionFee} adoption fee
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  if (loading && page === 1 && !isUsingDummyData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Available Pets</Text>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <PetCardSkeleton />}
          keyExtractor={item => item.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  if (error && !isUsingDummyData && allPets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load pets</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Pets</Text>
      {isUsingDummyData && (
        <View style={styles.offlineNotice}>
          <Text style={styles.offlineText}>
            Showing sample data (offline mode)
          </Text>
        </View>
      )}
      <FlatList
        data={allPets}
        renderItem={renderPetItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMorePets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading && page === 1}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  petCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  petInfo: {
    padding: 16,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  adoptionFee: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  offlineNotice: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEC107',
  },
  offlineText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  imagePlaceholder: {
    position: 'absolute',
    zIndex: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default PetListScreen;
