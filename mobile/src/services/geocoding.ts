import Geocoder from 'react-native-geocoding';

// Initialize with your Google Maps API key
export const initializeGeocoding = (apiKey: string) => {
  Geocoder.init(apiKey);
};

export interface GeocodingResult {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodingResult> => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    const result = response.results[0];
    
    if (!result) {
      throw new Error('No address found for this location');
    }

    // Parse address components
    const addressComponents = result.address_components;
    let street = '';
    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';

    addressComponents.forEach((component) => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        route = component.long_name;
      }
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (types.includes('postal_code')) {
        zipCode = component.long_name;
      }
      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    // Combine street number and route for full street address
    street = streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber;

    return {
      street,
      city,
      state,
      zipCode,
      country,
      formattedAddress: result.formatted_address,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to get address for this location');
  }
};

export const geocodeAddress = async (address: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
}> => {
  try {
    const response = await Geocoder.from(address);
    const result = response.results[0];
    
    if (!result) {
      throw new Error('No location found for this address');
    }

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to get location for this address');
  }
};