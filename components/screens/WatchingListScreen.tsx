import React from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWatchlist, useRemoveFromWatchlist } from '../../hooks/useWatchlist';
import { IMAGE_BASE } from '../../services/api';
import { colors, spacing } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import type { WatchlistItem } from '../../services/watchlist';

export function WatchingListScreen() {
  const navigation = useNavigation<any>();
  const { data: watchlist, isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handlePress = (item: WatchlistItem) => {
    navigation.navigate('Detail', { id: item.id, mediaType: item.mediaType });
  };

  const handleRemove = (item: WatchlistItem) => {
    Alert.alert('Remove from Watchlist', `Remove "${item.title}" from your watchlist?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromWatchlist.mutate({ id: item.id, mediaType: item.mediaType }) },
    ]);
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => {
    const imageUri = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

    return (
      <TouchableOpacity style={[styles.itemContainer, { backgroundColor: colors.surface }]} onPress={() => handlePress(item)} onLongPress={() => handleRemove(item)} activeOpacity={0.7}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={[styles.poster, { backgroundColor: colors.borderLight }]} />
        ) : (
          <View style={[styles.poster, styles.placeholder, { backgroundColor: colors.borderLight }]}>
            <Ionicons name="film-outline" size={24} color={colors.textTertiary} />
          </View>
        )}
        <View style={styles.itemInfo}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
            <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>{item.mediaType === 'movie' ? 'Movie' : 'TV Show'} • {item.vote_average.toFixed(1)}/10</Text>
          </View>
          <TouchableOpacity style={[styles.removeButton, { backgroundColor: colors.error }]} onPress={() => handleRemove(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={18} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  if (!watchlist || watchlist.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <EmptyState message="Your Watchlist is Empty" subMessage="Tap the bookmark button on any movie or TV show to add it here." icon={<Ionicons name="bookmark-outline" size={48} color={colors.textTertiary} />} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList data={watchlist} keyExtractor={(item) => `${item.mediaType}-${item.id}`} renderItem={renderItem} contentContainerStyle={[styles.listContent, { padding: spacing.md }]} showsVerticalScrollIndicator={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1 },
  listContent: { paddingBottom: 100 },
  itemContainer: { flexDirection: 'row', borderRadius: 12, marginBottom: spacing.md, overflow: 'hidden' },
  poster: { width: 80, height: 120 },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, padding: 12, flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemMeta: { fontSize: 13 },
  removeButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
});
