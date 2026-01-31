import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../../theme/simple';
import { IMAGE_BASE } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import type { MediaItem } from '../../types';

interface MediaCardProps {
  media: MediaItem;
  mediaType?: 'movie' | 'tv';
  showRating?: boolean;
}

function MediaCardComponent({ media, mediaType, showRating = true }: MediaCardProps) {
  const navigation = useNavigation<any>();
  const title = 'title' in media ? media.title : media.name;
  const rating = media.vote_average;
  const imageUri = media.poster_path ? `${IMAGE_BASE}${media.poster_path}` : null;
  const resolvedMediaType = mediaType || ('media_type' in media ? media.media_type : 'title' in media ? 'movie' : 'tv');

  const handlePress = () => navigation.navigate('Detail', { id: media.id, mediaType: resolvedMediaType });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.poster} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="film-outline" size={32} color={colors.textTertiary} />
            </View>
          )}
          {showRating && rating > 0 && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {'release_date' in media && media.release_date && (
            <Text style={styles.year}>{new Date(media.release_date).getFullYear()}</Text>
          )}
          {'first_air_date' in media && media.first_air_date && (
            <Text style={styles.year}>{new Date(media.first_air_date).getFullYear()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const MediaCard = memo(MediaCardComponent, (prev, next) =>
  prev.media.id === next.media.id &&
  prev.media.poster_path === next.media.poster_path &&
  prev.mediaType === next.mediaType
);

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 6,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  placeholder: {
    width: '100%',
    aspectRatio: 2 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
  },
  content: {
    paddingTop: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text,
  },
  year: {
    fontSize: 11,
    marginTop: 2,
    color: colors.textSecondary,
  },
});
