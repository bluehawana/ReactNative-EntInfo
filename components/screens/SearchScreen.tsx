import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSearch } from '../../hooks/useMedia';
import { colors, spacing } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SearchBar } from '../ui/SearchBar';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';

const SEARCH_DEBOUNCE_MS = 500;

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: content, isLoading, error } = useSearch(debouncedQuery);

  const handleClear = () => setQuery('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { padding: spacing.md }]}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search movies and TV shows..." onClear={handleClear} autoFocus />
      </View>

      {isLoading && query.length > 0 ? (
        <LoadingSpinner />
      ) : error ? (
        <EmptyState message="Failed to search. Please try again." />
      ) : content && content.length > 0 ? (
        <FlatList
          data={content}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <MediaCard media={item} />}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        />
      ) : debouncedQuery.length > 0 ? (
        <EmptyState message="No results found" icon="search-outline" />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.textTertiary} />
          <EmptyState message="Search for movies and TV shows" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingBottom: 0 },
  contentContainer: { paddingHorizontal: 8 },
  row: { justifyContent: 'space-around' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
});
