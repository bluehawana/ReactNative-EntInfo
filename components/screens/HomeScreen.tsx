import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useTrending } from '../../hooks/useMedia';
import { colors, spacing, typography } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { EmptyState } from '../ui/EmptyState';

export function HomeScreen() {
  const { data: content, isLoading, error, refetch } = useTrending();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorView message="Failed to load trending content" onRetry={refetch} />;
  }

  if (!content || content.length === 0) {
    return <EmptyState message="No trending content available" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={content}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <MediaCard media={item} />}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: spacing.lg }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 8 },
  row: { justifyContent: 'space-around' },
});
