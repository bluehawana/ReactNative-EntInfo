import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrendingByRegion } from '../../hooks/useTrendingByRegion';
import { colors, spacing } from '../../theme/simple';
import { MediaCard } from '../ui/MediaCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { EmptyState } from '../ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import type { Movie, TVShow } from '../../types';
import type { Region } from '../../hooks/useTrendingByRegion';

type RootStackParamList = { Detail: { id: number; mediaType: 'movie' | 'tv' } };
type RegionMediaItem = Movie | TVShow;
const NUM_COLUMNS = 2;
const INITIAL_RENDER = 8;
const BATCH_RENDER = 8;

export function TrendingByRegionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { regions, selectedRegion, setSelectedRegion, currentRegion, movies, tvs, isLoading, error, refetch } = useTrendingByRegion();
  const [activeTab, setActiveTab] = useState<'movies' | 'tvs'>('movies');
  const insets = useSafeAreaInsets();

  const items = activeTab === 'movies' ? movies : tvs;
  const mediaType = activeTab === 'movies' ? 'movie' : 'tv';

  const keyExtractor = useCallback((item: RegionMediaItem) => item.id.toString(), []);
  const renderItem = useCallback(
    ({ item }: { item: RegionMediaItem }) => (
      <MediaCard media={item} mediaType={mediaType} />
    ),
    [mediaType]
  );
  const renderRegionItem = useCallback(
    ({ item }: { item: Region }) => (
      <TouchableOpacity
        style={[
          styles.regionItem,
          selectedRegion === item.code && { backgroundColor: colors.primary },
        ]}
        onPress={() => setSelectedRegion(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.regionFlag}>{item.flag}</Text>
        <Text
          style={[
            styles.regionName,
            selectedRegion === item.code ? { color: colors.textInverse } : { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {item.code}
        </Text>
      </TouchableOpacity>
    ),
    [selectedRegion, setSelectedRegion]
  );

  if (isLoading && items.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorView message="Failed to load content" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>What's Trending</Text>
        <Text style={styles.headerSubtitle}>
          {currentRegion.flag} {currentRegion.name} • {activeTab === 'movies' ? 'In Theaters' : 'Airing Today'}
        </Text>
      </View>

      {/* Region Selector */}
      <View style={styles.regionSelector}>
        <FlatList
          horizontal
          data={regions}
          keyExtractor={(item) => item.code}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionList}
          renderItem={renderRegionItem}
        />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'movies' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('movies')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'movies' && { color: colors.textInverse }]}>In Theaters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tvs' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('tvs')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'tvs' && { color: colors.textInverse }]}>Airing Today</Text>
        </TouchableOpacity>
      </View>

      {/* Content - Same as MoviesScreen */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Ionicons name="film-outline" size={48} color={colors.textTertiary} />}
          message={`No ${activeTab === 'movies' ? 'movies in theaters' : 'TV shows airing today'}`}
          subMessage={`in ${currentRegion.name}`}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
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
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 2,
    color: colors.textSecondary,
  },
  regionSelector: {
    paddingVertical: spacing.sm,
  },
  regionList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  regionItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    minWidth: 48,
  },
  regionFlag: {
    fontSize: 18,
  },
  regionName: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-around',
  },
});
