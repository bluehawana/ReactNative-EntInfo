import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: content, isLoading, error } = useSearch(debouncedQuery);

  const handleClear = () => setQuery('');

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
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <MediaCard media={item} />}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
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
