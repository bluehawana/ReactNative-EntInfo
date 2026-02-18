import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSearch } from '../../hooks/useMedia';
import { colors, spacing } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SearchBar } from '../ui/SearchBar';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import type { TrendingItem } from '../../types';

const SEARCH_DEBOUNCE_MS = 500;
const NUM_COLUMNS = 2;
const INITIAL_RENDER = 8;
const BATCH_RENDER = 8;

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: content, isLoading, error } = useSearch(debouncedQuery);

  const handleClear = () => setQuery('');
  const keyExtractor = useCallback(
    (item: TrendingItem) => `${item.id}-${item.media_type}`,
    []
  );
  const renderItem = useCallback(
    ({ item }: { item: TrendingItem }) => <MediaCard media={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search movies and TV shows..." onClear={handleClear} />
      </View>

      {isLoading && query.length > 0 ? (
        <LoadingSpinner />
      ) : error ? (
        <EmptyState message="Failed to search. Please try again." />
      ) : content && content.length > 0 ? (
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
          showsVerticalScrollIndicator={false}
        />
      ) : debouncedQuery.length > 0 ? (
        <EmptyState message="No results found" />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Search for movies and TV shows</Text>
        </View>
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-around',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
