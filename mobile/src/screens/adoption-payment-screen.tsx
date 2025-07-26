import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAdoption } from '../contexts/AdoptionContext';

interface AdoptionPaymentScreenProps {
  route: any;
  navigation: any;
}

const AdoptionPaymentScreen: React.FC<AdoptionPaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const { pet } = route.params;
  const [loading, setLoading] = useState(false);
  const {
    adoptionData,
    setPetInfo,
    setPersonalInfo,
    setPaymentInfo,
    selectAddress,
  } = useAdoption();

  // Initialize pet info when component mounts
  useEffect(() => {
    setPetInfo(pet.id, pet.name, pet.breed, pet.adoptionFee);
  }, [pet.id, pet.name, pet.breed, pet.adoptionFee, setPetInfo]);

  // Initialize form data from context, but only once
  const [formData, setFormData] = useState(() => ({
    fullName: adoptionData.personalInfo?.fullName || '',
    email: adoptionData.personalInfo?.email || '',
    phone: adoptionData.personalInfo?.phone || '',
    cardNumber: adoptionData.paymentInfo?.cardNumber || '',
    expiryDate: adoptionData.paymentInfo?.expiryDate || '',
    cvv: adoptionData.paymentInfo?.cvv || '',
  }));

  // Update form data when context changes (but only if it's different)
  useEffect(() => {
    setFormData(prev => {
      const newData = {
        fullName: adoptionData.personalInfo?.fullName || '',
        email: adoptionData.personalInfo?.email || '',
        phone: adoptionData.personalInfo?.phone || '',
        cardNumber: adoptionData.paymentInfo?.cardNumber || '',
        expiryDate: adoptionData.paymentInfo?.expiryDate || '',
        cvv: adoptionData.paymentInfo?.cvv || '',
      };

      // Only update if data actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newData)) {
        return newData;
      }
      return prev;
    });
  }, [adoptionData.personalInfo, adoptionData.paymentInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectAddress = () => {
    navigation.navigate('Location', {
      mode: 'select',
      onAddressSelected: async (latitude: number, longitude: number) => {
        try {
          await selectAddress(latitude, longitude);
          navigation.goBack();
        } catch (error) {
          Alert.alert('Error', 'Failed to get address for this location');
        }
      },
    });
  };

  const validateForm = () => {
    const { fullName, email, phone, cardNumber, expiryDate, cvv } = formData;
    if (!fullName || !email || !phone || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!adoptionData.selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (cardNumber.length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return false;
    }
    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    // Update context with form data
    setPersonalInfo({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
    });
    setPaymentInfo({
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    });

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Adoption Successful!',
        `Congratulations! You have successfully adopted ${pet.name}. We will contact you shortly with next steps.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PetList'),
          },
        ],
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Adopt {pet.name}</Text>
        <Text style={styles.subtitle}>Complete your adoption</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Adoption Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pet:</Text>
            <Text style={styles.summaryValue}>
              {pet.name} ({pet.breed})
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Adoption Fee:</Text>
            <Text style={styles.summaryValue}>${pet.adoptionFee}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={formData.fullName}
            onChangeText={value => handleInputChange('fullName', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <TouchableOpacity
            style={styles.addressSelector}
            onPress={handleSelectAddress}
          >
            {adoptionData.selectedAddress ? (
              <View>
                <Text style={styles.addressText}>
                  {adoptionData.selectedAddress.street}
                </Text>
                <Text style={styles.addressSubtext}>
                  {[
                    adoptionData.selectedAddress.city,
                    adoptionData.selectedAddress.state,
                    adoptionData.selectedAddress.zipCode
                  ].filter(Boolean).join(', ')}
                  {adoptionData.selectedAddress.country && `, ${adoptionData.selectedAddress.country}`}
                </Text>
                {adoptionData.selectedAddress.formattedAddress && (
                  <Text style={styles.addressFullText}>
                    {adoptionData.selectedAddress.formattedAddress}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={styles.addressPlaceholder}>
                Tap to select address on map
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Payment Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Card Number"
            placeholderTextColor="#999"
            value={formData.cardNumber}
            onChangeText={value => handleInputChange('cardNumber', value)}
            keyboardType="numeric"
            maxLength={16}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              value={formData.expiryDate}
              onChangeText={value => handleInputChange('expiryDate', value)}
              maxLength={5}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              placeholderTextColor="#999"
              value={formData.cvv}
              onChangeText={value => handleInputChange('cvv', value)}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.payButtonText}>
                Complete Adoption (${pet.adoptionFee})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  addressSelector: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 60,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  addressSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addressFullText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  addressPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AdoptionPaymentScreen;
