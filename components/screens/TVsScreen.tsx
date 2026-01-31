import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Text, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePopularTV } from '../../hooks/useMedia';
import { colors, spacing } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { EmptyState } from '../ui/EmptyState';

export function TVsScreen() {
  const { data: content, isLoading, error, refetch } = usePopularTV();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorView message="Failed to load TV shows" onRetry={refetch} />;
  }

  if (!content || content.length === 0) {
    return <EmptyState message="No TV shows available" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>TV Shows</Text>
      </View>
      <FlatList
        data={content}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <MediaCard media={item} mediaType="tv" />}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
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
