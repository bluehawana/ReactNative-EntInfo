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

  const getRatingColor = (r: number) => r >= 7 ? colors.success : r >= 5 ? colors.warning : colors.error;

  const handlePress = () => navigation.navigate('Detail', { id: media.id, mediaType: resolvedMediaType });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: spacing.sm }]}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.poster} resizeMode="cover" />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: colors.borderLight }]}>
              <Ionicons name="film-outline" size={32} color={colors.textTertiary} />
            </View>
          )}
          {showRating && rating > 0 && <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(rating) }]}><Text style={[styles.ratingText, { color: colors.textInverse }]}>{rating.toFixed(1)}</Text></View>}
        </View>
        <View style={[styles.content, { padding: spacing.xs }]}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
          {'release_date' in media && media.release_date && <Text style={[styles.year, { color: colors.textTertiary }]}>{new Date(media.release_date).getFullYear()}</Text>}
          {'first_air_date' in media && media.first_air_date && <Text style={[styles.year, { color: colors.textTertiary }]}>{new Date(media.first_air_date).getFullYear()}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const MediaCard = memo(MediaCardComponent, (prev, next) => prev.media.id === next.media.id && prev.media.poster_path === next.media.poster_path && prev.mediaType === next.mediaType);

const styles = StyleSheet.create({
  container: { width: '50%', padding: 6 },
  card: { overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  poster: { width: '100%', aspectRatio: 2 / 3 },
  placeholder: { width: '100%', aspectRatio: 2 / 3, justifyContent: 'center', alignItems: 'center' },
  ratingBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { fontSize: 11, fontWeight: '600' },
  content: { paddingTop: 8 },
  title: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  year: { fontSize: 11, marginTop: 2 },
});
