import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AddressModal from '../components/address-modal';
import { useAdoption } from '../contexts/AdoptionContext';

// Note: Geocoding is now handled in the AdoptionContext

interface LocationScreenProps {
  navigation: any;
  route: any;
}

const LocationScreen: React.FC<LocationScreenProps> = ({
  navigation: _navigation,
  route,
}) => {
  const mode = route.params?.mode || 'view';
  const onAddressSelected = route.params?.onAddressSelected;
  const { adoptionData, selectAddress } = useAdoption();
  
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [centerCoords, setCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView>(null);

  const requestLocationPermission = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentLocation = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      const coords = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };

      setLocation(coords);
      setCenterCoords(coords);

      // Center map on current location
      if (mapRef.current && isMapReady) {
        mapRef.current.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000,
        );
      }
    } catch (locationError: any) {
      const { code, message } = locationError;
      console.warn('Location error:', code, message);

      let errorMessage = 'Failed to get location';

      switch (code) {
        case 'UNAUTHORIZED':
          errorMessage =
            'Location permission denied. Please enable location access in Settings.';
          break;
        case 'TIMEOUT':
          errorMessage = 'Location request timed out. Please try again.';
          break;
        case 'UNAVAILABLE':
          errorMessage =
            'Location services are not available. Please check your device settings.';
          break;
        case 'UNKNOWN':
          errorMessage = 'Unknown location error. Please try again.';
          break;
        default:
          errorMessage =
            message ||
            'Failed to get location. Please check your device settings.';
      }

      setError(errorMessage);

      if (code === 'UNAUTHORIZED') {
        Alert.alert(
          'Location Permission Required',
          'PetWatch needs access to your location to show your current coordinates. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                Alert.alert(
                  'Open Settings',
                  'Go to Settings > Privacy & Security > Location Services > PetWatch and enable "While Using App"',
                  [{ text: 'OK' }],
                );
              },
            },
          ],
        );
      }
    } finally {
      setLoading(false);
    }
  }, [mapRef, isMapReady]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setCenterCoords(coordinate);

    // Get address for selected location
    setAddressLoading(true);
    try {
      await selectAddress(
        coordinate.latitude,
        coordinate.longitude,
      );
      setModalVisible(true);
    } catch {
      Alert.alert('Error', 'Failed to get address for this location');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleRegionChangeComplete = (region: any) => {
    setCenterCoords({ latitude: region.latitude, longitude: region.longitude });
  };

  const handleAddressConfirm = (address: any) => {
    if (mode === 'select' && onAddressSelected) {
      // Pass the coordinates back to the previous screen
      if (centerCoords) {
        onAddressSelected(centerCoords.latitude, centerCoords.longitude);
      }
      // Don't automatically navigate back - let user choose
      setModalVisible(false);
    } else {
      // Just show confirmation for view mode
      Alert.alert(
        'Address Confirmed',
        `${address.street}\n${address.city}, ${address.state} ${address.zipCode}`,
        [{ text: 'OK' }],
      );
    }
  };

  const refreshLocation = () => {
    requestLocationPermission();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {loading && !location && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}

        {location && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onMapReady={() => setIsMapReady(true)}
              onPress={handleMapPress}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation
              showsMyLocationButton
            >
              {/* Current Location Marker (only show if different from center) */}
              {location &&
                centerCoords &&
                (location.latitude !== centerCoords.latitude ||
                  location.longitude !== centerCoords.longitude) && (
                  <Marker
                    coordinate={location}
                    title="Your Current Location"
                    description="Where you are now"
                  >
                    <View style={styles.currentLocationBalloon}>
                      <Text style={styles.currentLocationText}>
                        You are here
                      </Text>
                    </View>
                  </Marker>
                )}

              {/* Dragged/Picked Location Marker (center of map) */}
              {centerCoords && (
                <Marker
                  coordinate={centerCoords}
                  title="Selected Location"
                  description="Tap 'Select This Location' to confirm"
                >
                  <View style={styles.locationPinContainer}>
                    <View style={styles.locationPin}>
                      <View style={styles.pinDot} />
                    </View>
                    <View style={styles.pinShadow} />
                  </View>
                </Marker>
              )}
            </MapView>

            {/* Center pin overlay */}
            <View style={styles.centerPinContainer}>
              <Image
                source={{
                  uri: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                }}
                style={styles.centerPin}
              />
            </View>

            {/* Map controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={async () => {
                  if (centerCoords) {
                    setAddressLoading(true);
                    try {
                      await selectAddress(
                        centerCoords.latitude,
                        centerCoords.longitude,
                      );
                      setModalVisible(true);
                    } catch {
                      Alert.alert(
                        'Error',
                        'Failed to get address for this location',
                      );
                    } finally {
                      setAddressLoading(false);
                    }
                  }
                }}
              >
                <Text style={styles.selectButtonText}>
                  Select This Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHelpText}>
              Make sure location services are enabled and PetWatch has
              permission to access your location.
            </Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshLocation}
            >
              <Text style={styles.refreshButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && !location && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
      </View>

      <AddressModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddressConfirm}
        initialAddress={adoptionData?.selectedAddress || undefined} // Changed to use adoptionData
        loading={addressLoading && modalVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
    pointerEvents: 'none',
  },
  centerPin: {
    width: 30,
    height: 30,
  },
  mapControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHelpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  refreshButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationBalloon: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
  locationPinContainer: {
    alignItems: 'center',
  },
  locationPin: {
    width: 24,
    height: 36,
    alignItems: 'center',
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  pinShadow: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 2,
  },
});

export default LocationScreen;
