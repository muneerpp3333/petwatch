import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const PetCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.imageSkeleton}
        shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
      />
      <View style={styles.contentContainer}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.titleSkeleton}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.subtitleSkeleton}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.locationSkeleton}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.priceSkeleton}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  imageSkeleton: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  titleSkeleton: {
    width: '60%',
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    width: '80%',
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  locationSkeleton: {
    width: '50%',
    height: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  priceSkeleton: {
    width: '40%',
    height: 18,
    borderRadius: 4,
  },
});

export default PetCardSkeleton;