import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  locationButton: {
    marginRight: 16,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

const LocationButton = ({ navigation }: { navigation: any }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Location')}
    style={styles.locationButton}
  >
    <Text style={styles.locationButtonText}>Location</Text>
  </TouchableOpacity>
);

export default LocationButton;
