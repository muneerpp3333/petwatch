import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';

const { width: screenWidth } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
  showThumbnails?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagePress,
  showThumbnails = true,
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setIsViewerOpen(true);
    onImagePress?.(index);
  };

  const imageUrls = images.map(url => ({ url }));

  return (
    <View>
      {/* Main Image */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleImagePress(0)}
      >
        <FastImage
          source={{ uri: images[0] }}
          style={styles.mainImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.imageCountBadge}>
          <Text style={styles.imageCountText}>1 / {images.length}</Text>
        </View>
      </TouchableOpacity>

      {/* Thumbnail Strip */}
      {showThumbnails && images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
              style={[
                styles.thumbnailWrapper,
                index === 0 && styles.activeThumbnail,
              ]}
            >
              <FastImage
                source={{ uri: image }}
                style={styles.thumbnail}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Full Screen Image Viewer */}
      <Modal
        visible={isViewerOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsViewerOpen(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={currentIndex}
          onSwipeDown={() => setIsViewerOpen(false)}
          onCancel={() => setIsViewerOpen(false)}
          enableSwipeDown={true}
          enableImageZoom={true}
          useNativeDriver={true}
          saveToLocalByLongPress={false}
          renderIndicator={(currentIndex?: number, allSize?: number) => (
            <View style={styles.indicator}>
              <Text style={styles.indicatorText}>
                {currentIndex} / {allSize}
              </Text>
            </View>
          )}
          renderHeader={() => (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsViewerOpen(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    width: screenWidth,
    height: screenWidth * 0.75,
    backgroundColor: '#f0f0f0',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  thumbnailContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  thumbnailWrapper: {
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#4CAF50',
  },
  thumbnail: {
    width: 70,
    height: 70,
  },
  indicator: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default ImageGallery;