import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ImageGallery from '../components/image-gallery';

interface PetDetailsScreenProps {
  route: any;
  navigation: any;
}

const PetDetailsScreen: React.FC<PetDetailsScreenProps> = ({ route, navigation }) => {
  const { pet } = route.params;

  const handleAdopt = () => {
    navigation.navigate('AdoptionPayment', { pet });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery images={pet.images || [pet.imageUrl]} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>
            {pet.breed} • {pet.gender} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
          </Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{pet.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Adoption Fee</Text>
              <Text style={styles.infoValue}>${pet.adoptionFee}</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, pet.vaccinated && styles.statusBadgeActive]}>
              <Text style={[styles.statusText, pet.vaccinated && styles.statusTextActive]}>
                {pet.vaccinated ? '✓ Vaccinated' : 'Not Vaccinated'}
              </Text>
            </View>
            <View style={[styles.statusBadge, pet.neutered && styles.statusBadgeActive]}>
              <Text style={[styles.statusText, pet.neutered && styles.statusTextActive]}>
                {pet.neutered ? '✓ Neutered' : 'Not Neutered'}
              </Text>
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.description}>{pet.description}</Text>
          </View>
          
          <TouchableOpacity style={styles.adoptButton} onPress={handleAdopt}>
            <Text style={styles.adoptButtonText}>Adopt {pet.name}</Text>
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
  contentContainer: {
    padding: 20,
  },
  petName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  petBreed: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusBadgeActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  adoptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adoptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PetDetailsScreen;