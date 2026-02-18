import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWatchlist, useRemoveFromWatchlist } from '../../hooks/useWatchlist';
import { IMAGE_BASE } from '../../services/api';
import { colors, spacing } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import type { WatchlistItem } from '../../services/watchlist';

const WATCHLIST_ROW_HEIGHT = 120 + spacing.md;
const INITIAL_RENDER = 8;
const BATCH_RENDER = 8;

interface WatchlistRowProps {
  item: WatchlistItem;
  onPress: (item: WatchlistItem) => void;
  onRemove: (item: WatchlistItem) => void;
}

const WatchlistRow = memo(
  function WatchlistRowComponent({ item, onPress, onRemove }: WatchlistRowProps) {
    const imageUri = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: colors.surface }]}
        onPress={() => onPress(item)}
        onLongPress={() => onRemove(item)}
        activeOpacity={0.7}
      >
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
          <TouchableOpacity style={[styles.removeButton, { backgroundColor: colors.error }]} onPress={() => onRemove(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={18} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.mediaType === next.item.mediaType &&
    prev.item.title === next.item.title &&
    prev.item.poster_path === next.item.poster_path &&
    prev.item.vote_average === next.item.vote_average &&
    prev.onPress === next.onPress &&
    prev.onRemove === next.onRemove
);

export function WatchingListScreen() {
  const navigation = useNavigation<any>();
  const { data: watchlist, isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handlePress = useCallback(
    (item: WatchlistItem) => {
      navigation.navigate('Detail', { id: item.id, mediaType: item.mediaType });
    },
    [navigation]
  );

  const handleRemove = useCallback(
    (item: WatchlistItem) => {
      Alert.alert('Remove from Watchlist', `Remove "${item.title}" from your watchlist?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWatchlist.mutate({ id: item.id, mediaType: item.mediaType }),
        },
      ]);
    },
    [removeFromWatchlist]
  );

  const keyExtractor = useCallback(
    (item: WatchlistItem) => `${item.mediaType}-${item.id}`,
    []
  );
  const renderItem = useCallback(
    ({ item }: { item: WatchlistItem }) => (
      <WatchlistRow item={item} onPress={handlePress} onRemove={handleRemove} />
    ),
    [handlePress, handleRemove]
  );
  const getItemLayout = useCallback(
    (_data: ArrayLike<WatchlistItem> | null | undefined, index: number) => ({
      length: WATCHLIST_ROW_HEIGHT,
      offset: WATCHLIST_ROW_HEIGHT * index,
      index,
    }),
    []
  );

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
      <FlatList
        data={watchlist}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
        getItemLayout={getItemLayout}
        initialNumToRender={INITIAL_RENDER}
        maxToRenderPerBatch={BATCH_RENDER}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
      />
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
