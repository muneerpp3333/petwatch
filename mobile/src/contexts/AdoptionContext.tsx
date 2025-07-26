import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  GeocodingResult,
  reverseGeocode,
  initializeGeocoding,
} from '../services/geocoding';
import config from '../config';

// Initialize geocoding with API key
initializeGeocoding(config.GOOGLE_MAPS_API_KEY);

interface AdoptionData {
  petId?: string;
  petName?: string;
  petBreed?: string;
  adoptionFee?: number;
  selectedAddress?: GeocodingResult;
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  isAddressLoading: boolean;
  addressError?: string;
}

interface AdoptionContextType {
  adoptionData: AdoptionData;
  setPetInfo: (
    petId: string,
    petName: string,
    petBreed: string,
    adoptionFee: number,
  ) => void;
  setPersonalInfo: (info: {
    fullName: string;
    email: string;
    phone: string;
  }) => void;
  setPaymentInfo: (info: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => void;
  selectAddress: (latitude: number, longitude: number) => Promise<void>;
  clearAddress: () => void;
  clearAdoptionData: () => void;
  isAdoptionComplete: () => boolean;
}

const AdoptionContext = createContext<AdoptionContextType | undefined>(
  undefined,
);

interface AdoptionProviderProps {
  children: ReactNode;
}

export const AdoptionProvider: React.FC<AdoptionProviderProps> = ({
  children,
}) => {
  const [adoptionData, setAdoptionData] = useState<AdoptionData>({
    isAddressLoading: false,
  });

  const setPetInfo = useCallback(
    (petId: string, petName: string, petBreed: string, adoptionFee: number) => {
      setAdoptionData(prev => ({
        ...prev,
        petId,
        petName,
        petBreed,
        adoptionFee,
      }));
    },
    [],
  );

  const setPersonalInfo = useCallback(
    (info: { fullName: string; email: string; phone: string }) => {
      setAdoptionData(prev => ({
        ...prev,
        personalInfo: info,
      }));
    },
    [],
  );

  const setPaymentInfo = useCallback(
    (info: { cardNumber: string; expiryDate: string; cvv: string }) => {
      setAdoptionData(prev => ({
        ...prev,
        paymentInfo: info,
      }));
    },
    [],
  );

  console.log('adoptionData', adoptionData);

  const selectAddress = useCallback(
    async (latitude: number, longitude: number) => {
      setAdoptionData(prev => ({
        ...prev,
        isAddressLoading: true,
        addressError: undefined,
      }));

      try {
        const address = await reverseGeocode(latitude, longitude);
        setAdoptionData(prev => ({
          ...prev,
          selectedAddress: address,
          isAddressLoading: false,
        }));
      } catch (error) {
        setAdoptionData(prev => ({
          ...prev,
          addressError: 'Failed to get address for this location',
          isAddressLoading: false,
        }));
        throw error;
      }
    },
    [],
  );

  const clearAddress = useCallback(() => {
    setAdoptionData(prev => ({
      ...prev,
      selectedAddress: undefined,
      addressError: undefined,
    }));
  }, []);

  const clearAdoptionData = useCallback(() => {
    setAdoptionData({
      isAddressLoading: false,
    });
  }, []);

  const isAdoptionComplete = useCallback(() => {
    return !!(
      adoptionData.petId &&
      adoptionData.personalInfo?.fullName &&
      adoptionData.personalInfo?.email &&
      adoptionData.personalInfo?.phone &&
      adoptionData.paymentInfo?.cardNumber &&
      adoptionData.paymentInfo?.expiryDate &&
      adoptionData.paymentInfo?.cvv &&
      adoptionData.selectedAddress
    );
  }, [adoptionData]);

  const value = useMemo(
    () => ({
      adoptionData,
      setPetInfo,
      setPersonalInfo,
      setPaymentInfo,
      selectAddress,
      clearAddress,
      clearAdoptionData,
      isAdoptionComplete,
    }),
    [
      adoptionData,
      setPetInfo,
      setPersonalInfo,
      setPaymentInfo,
      selectAddress,
      clearAddress,
      clearAdoptionData,
      isAdoptionComplete,
    ],
  );

  return (
    <AdoptionContext.Provider value={value}>
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoption = (): AdoptionContextType => {
  const context = useContext(AdoptionContext);
  if (context === undefined) {
    throw new Error('useAdoption must be used within an AdoptionProvider');
  }
  return context;
};
