import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: AddressData) => void;
  initialAddress?: AddressData;
  loading?: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialAddress,
  loading = false,
}) => {
  const [address, setAddress] = useState<AddressData>(
    initialAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      formattedAddress: '',
      latitude: 0,
      longitude: 0,
    },
  );

  const slideAnim = useState(new Animated.Value(300))[0];
  
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleConfirm = () => {
    const isValid = address.street && address.city && address.state;
    if (!isValid) {
      Alert.alert('Please fill in all required address fields');
      return;
    }
    onConfirm(address);
    onClose();
  };

  const updateField = (field: keyof AddressData, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Confirm Address</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>
                      Getting address details...
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.addressPreview}>
                      <Text style={styles.previewLabel}>
                        Selected Location:
                      </Text>
                      <Text style={styles.previewText}>
                        {address.formattedAddress || 'No address selected'}
                      </Text>
                    </View>

                    <View style={styles.form}>
                      <Text style={styles.inputLabel}>Street Address</Text>
                      <TextInput
                        style={styles.input}
                        value={address.street}
                        onChangeText={text => updateField('street', text)}
                        placeholder="123 Main Street"
                      />

                      <View style={styles.row}>
                        <View style={styles.flex1}>
                          <Text style={styles.inputLabel}>City</Text>
                          <TextInput
                            style={styles.input}
                            value={address.city}
                            onChangeText={text => updateField('city', text)}
                            placeholder="San Francisco"
                          />
                        </View>

                        <View style={styles.stateContainer}>
                          <Text style={styles.inputLabel}>State</Text>
                          <TextInput
                            style={styles.input}
                            value={address.state}
                            onChangeText={text => updateField('state', text)}
                            placeholder="CA"
                            maxLength={2}
                          />
                        </View>
                      </View>

                      <View style={styles.row}>
                        <View style={styles.flex1}>
                          <Text style={styles.inputLabel}>ZIP Code</Text>
                          <TextInput
                            style={styles.input}
                            value={address.zipCode}
                            onChangeText={text => updateField('zipCode', text)}
                            placeholder="94102"
                            keyboardType="numeric"
                            maxLength={5}
                          />
                        </View>

                        <View style={styles.flex1}>
                          <Text style={styles.inputLabel}>Country</Text>
                          <TextInput
                            style={[styles.input, styles.countryInput]}
                            value={address.country}
                            editable={false}
                          />
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirm}
                    >
                      <Text style={styles.confirmButtonText}>
                        Confirm Address
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  addressPreview: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  stateContainer: {
    width: 80,
  },
  countryInput: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddressModal;
