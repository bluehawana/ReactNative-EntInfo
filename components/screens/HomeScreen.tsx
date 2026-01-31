import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTrending, useTopRatedMovies, useTopRatedTV } from '../../hooks/useMedia';
import { colors, spacing } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { EmptyState } from '../ui/EmptyState';
import { IMAGE_BASE_LARGE, IMAGE_BASE } from '../../services/api';
import type { TrendingItem, Movie, TVShow } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.55;
const CARD_WIDTH = 110;
const CARD_HEIGHT = 165;
const AUTO_SCROLL_INTERVAL = 5000;

export function HomeScreen() {
  const { data: content, isLoading: trendingLoading, error, refetch } = useTrending();
  const { data: topMovies } = useTopRatedMovies();
  const { data: topTV } = useTopRatedTV();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const heroScrollRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const heroItems = content?.slice(0, 8) || [];
  const trendingContent = content?.slice(3, 15) || [];

  const highlyRecommend = React.useMemo(() => {
    const movies = (topMovies || []).slice(0, 10);
    const tv = (topTV || []).slice(0, 10);
    return [...movies, ...tv]
      .filter((item: Movie | TVShow) => item.vote_average >= 7)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 12);
  }, [topMovies, topTV]);

  useEffect(() => {
    if (heroItems.length > 1) {
      autoScrollTimer.current = setInterval(() => {
        setActiveHeroIndex((prev) => {
          const nextIndex = (prev + 1) % heroItems.length;
          heroScrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, AUTO_SCROLL_INTERVAL);
    }
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [heroItems.length]);

  const resetAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      setActiveHeroIndex((prev) => {
        const nextIndex = (prev + 1) % heroItems.length;
        heroScrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, [heroItems.length]);

  const onHeroScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeHeroIndex && index >= 0 && index < heroItems.length) {
      setActiveHeroIndex(index);
      resetAutoScroll();
    }
  }, [activeHeroIndex, heroItems.length, resetAutoScroll]);

  const getTitle = (item: TrendingItem | Movie | TVShow) => {
    if ('title' in item) return item.title;
    if ('name' in item) return item.name;
    return '';
  };

  const getBackdropUrl = (item: TrendingItem | Movie | TVShow) => {
    if ('backdrop_path' in item && item.backdrop_path) {
      return `${IMAGE_BASE_LARGE}${item.backdrop_path}`;
    }
    if (item.poster_path) {
      return `${IMAGE_BASE_LARGE}${item.poster_path}`;
    }
    return null;
  };

  const getPosterUrl = (item: TrendingItem | Movie | TVShow) =>
    item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;

  const getMediaType = (item: Movie | TVShow | TrendingItem) => {
    if ('media_type' in item) return item.media_type;
    return 'title' in item ? 'movie' : 'tv';
  };

  const handleHeroPress = (item: TrendingItem) => {
    navigation.navigate('Detail', { id: item.id, mediaType: item.media_type });
  };

  const handleCardPress = (item: Movie | TVShow | TrendingItem) => {
    const mediaType = getMediaType(item);
    navigation.navigate('Detail', { id: item.id, mediaType });
  };

  const renderHeroItem = ({ item, index }: { item: TrendingItem; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleHeroPress(item)}
        style={styles.heroSlide}
      >
        <View style={styles.heroImageContainer}>
          {getBackdropUrl(item) ? (
            <Image
              source={{ uri: getBackdropUrl(item)! }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="film-outline" size={64} color={colors.textTertiary} />
            </View>
          )}

          {/* Bottom gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(15,23,30,0.4)', 'rgba(15,23,30,0.85)', colors.background]}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.heroGradient}
          />
          {/* Top gradient for status bar */}
          <LinearGradient
            colors={['rgba(15,23,30,0.7)', 'transparent']}
            style={styles.heroTopGradient}
          />

          {/* Hero content - Prime Video style */}
          <View style={[styles.heroContent, { paddingBottom: 16 }]}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {getTitle(item)}
            </Text>
            <View style={styles.heroMeta}>
              <Text style={styles.metaText}>
                {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
              </Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>Trending #{index + 1}</Text>
            </View>
            <View style={styles.includedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#00A8E1" />
              <Text style={styles.includedText}>Included with Premium</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPosterCard = ({ item }: { item: Movie | TVShow | TrendingItem }) => (
    <TouchableOpacity
      style={styles.posterCard}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.85}
    >
      {getPosterUrl(item) ? (
        <Image
          source={{ uri: getPosterUrl(item)! }}
          style={styles.posterImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.posterImage, styles.posterPlaceholder]}>
          <Ionicons name="film-outline" size={28} color={colors.textTertiary} />
        </View>
      )}
    </TouchableOpacity>
  );

  if (trendingLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return <ErrorView message="Failed to load content" onRetry={refetch} />;
  }

  if (!content || content.length === 0) {
    return <EmptyState message="No content available" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating App Title */}
      <View style={[styles.appHeader, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.appTitle}>EntInfo</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
          <Animated.FlatList
            ref={heroScrollRef}
            data={heroItems}
            keyExtractor={(item) => `hero-${item.id}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: onHeroScroll }
            )}
            scrollEventThrottle={16}
            renderItem={renderHeroItem}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {heroItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeHeroIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Top TV Section */}
        {topTV && topTV.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top TV</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
            <FlatList
              horizontal
              data={topTV.slice(0, 12)}
              keyExtractor={(item, index) => `toptv-${item.id}-${index}`}
              renderItem={renderPosterCard}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Highly Recommend Section */}
        {highlyRecommend.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Highly Recommend</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
            <FlatList
              horizontal
              data={highlyRecommend}
              keyExtractor={(item, index) => `rec-${item.id}-${index}-${'title' in item ? 'm' : 't'}`}
              renderItem={renderPosterCard}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Trending Now Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
          <FlatList
            horizontal
            data={trendingContent}
            keyExtractor={(item, index) => `trend-${item.id}-${index}`}
            renderItem={renderPosterCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Top Movies Section */}
        {topMovies && topMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Movies</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
            <FlatList
              horizontal
              data={topMovies.slice(0, 12)}
              keyExtractor={(item, index) => `topmovie-${item.id}-${index}`}
              renderItem={renderPosterCard}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00A8E1',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroSlide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  heroImageContainer: {
    flex: 1,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * 0.65,
  },
  heroTopGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 8,
  },
  includedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  includedText: {
    fontSize: 12,
    color: '#00A8E1',
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  posterCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 6,
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
