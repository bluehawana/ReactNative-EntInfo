import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrendingByRegion } from '../../hooks/useTrendingByRegion';
import { IMAGE_BASE, REGIONS } from '../../services/api';
import { colors, spacing, typography } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = { Detail: { id: number; mediaType: 'movie' | 'tv' } };

export function TrendingByRegionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { regions, selectedRegion, setSelectedRegion, currentRegion, movies, tvs, isLoading } = useTrendingByRegion();
  const [activeTab, setActiveTab] = useState<'movies' | 'tvs'>('movies');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [selectedRegion, activeTab]);

  const handleItemPress = (item: any, mediaType: 'movie' | 'tv') => {
    navigation.navigate('Detail', { id: item.id, mediaType });
  };

  if (isLoading) return <View style={[styles.container, { backgroundColor: colors.background }]}><LoadingSpinner /></View>;

  const items = activeTab === 'movies' ? movies : tvs;

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>What's Trending</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {currentRegion.flag} {currentRegion.name} • {activeTab === 'movies' ? 'In Theaters' : 'Airing Today'}
        </Text>
      </View>

      {/* Region Selector */}
      <View style={styles.regionSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionList}>
          {regions.map((region) => (
            <TouchableOpacity
              key={region.code}
              style={[
                styles.regionItem,
                selectedRegion === region.code && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedRegion(region.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.regionFlag}>{region.flag}</Text>
              <Text
                style={[
                  styles.regionName,
                  selectedRegion === region.code ? { color: colors.textInverse } : { color: colors.text },
                ]}
                numberOfLines={1}
              >
                {region.code}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="film-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No {activeTab === 'movies' ? 'movies in theaters' : 'TV shows airing today'}</Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>in {currentRegion.name}</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {items.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleItemPress(item, activeTab === 'movies' ? 'movie' : 'tv')} activeOpacity={0.7}>
                <View style={styles.posterWrapper}>
                  {item.poster_path ? (
                    <Image
                      source={{ uri: `${IMAGE_BASE}${item.poster_path}` }}
                      style={styles.poster}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.poster, styles.posterPlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
                      <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
                    </View>
                  )}
                  <View style={styles.rankBadge}>
                    <Text style={[styles.rankText, { color: colors.textInverse }]}>{index + 1}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {activeTab === 'movies' ? item.title : item.name}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Ionicons name="star" size={12} color={colors.warning} />
                    <Text style={[styles.cardRating, { color: colors.textSecondary }]}>{item.vote_average?.toFixed(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: spacing.lg + 20, paddingBottom: spacing.sm },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSubtitle: { fontSize: 15, marginTop: 2 },
  regionSelector: { paddingVertical: spacing.sm },
  regionList: { paddingHorizontal: 16, gap: 8 },
  regionItem: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: colors.surfaceSecondary, minWidth: 48 },
  regionFlag: { fontSize: 18 },
  regionName: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.surfaceSecondary, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  content: { paddingTop: spacing.md, paddingHorizontal: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl * 2 },
  emptyText: { fontSize: 16, marginTop: 16 },
  emptyHint: { fontSize: 14, marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: cardWidth, marginBottom: spacing.md },
  posterWrapper: { position: 'relative' },
  poster: { width: cardWidth, height: cardWidth * 1.5, borderRadius: 12 },
  posterPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  rankBadge: { position: 'absolute', top: 8, left: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  rankText: { fontSize: 14, fontWeight: '700' },
  cardContent: { paddingTop: 8 },
  cardTitle: { fontSize: 13, fontWeight: '600', height: 34 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardRating: { fontSize: 12, marginLeft: 4 },
});
