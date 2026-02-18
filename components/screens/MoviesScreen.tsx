import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePopularMovies } from '../../hooks/useMedia';
import { colors, spacing } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { EmptyState } from '../ui/EmptyState';
import type { Movie } from '../../types';

const NUM_COLUMNS = 2;
const INITIAL_RENDER = 8;
const BATCH_RENDER = 8;

export function MoviesScreen() {
  const { data: content, isLoading, error, refetch } = usePopularMovies();
  const insets = useSafeAreaInsets();
  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);
  const renderItem = useCallback(
    ({ item }: { item: Movie }) => <MediaCard media={item} mediaType="movie" />,
    []
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorView message="Failed to load movies" onRetry={refetch} />;
  }

  if (!content || content.length === 0) {
    return <EmptyState message="No movies available" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Movies</Text>
      </View>
      <FlatList
        data={content}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        initialNumToRender={INITIAL_RENDER}
        maxToRenderPerBatch={BATCH_RENDER}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-around',
  },
});
