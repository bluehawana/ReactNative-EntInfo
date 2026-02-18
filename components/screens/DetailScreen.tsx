import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, StatusBar, Platform, Animated, Alert, Linking as RNLinking } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useMediaDetail } from '../../hooks/useMedia';
import { useIsInWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../../hooks/useWatchlist';
import { useAuth } from '../../hooks/useAuth';
import { IMAGE_ORIGINAL, IMAGE_BASE_LARGE, PROFILE_BASE, PROVIDER_LOGO_BASE } from '../../services/api';
import { getProviderWebUrl, openStreamingProvider } from '../../services/streamingLinks';
import { colors, spacing, typography } from '../../theme/simple';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorView } from '../ui/ErrorView';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = { Detail: { id: number; mediaType: 'movie' | 'tv' } };
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { id, mediaType } = route.params;
  const { details, credits, providers, isLoading, error, refetch } = useMediaDetail(id, mediaType);
  const { user } = useAuth();
  const { data: inWatchlist } = useIsInWatchlist(id, mediaType);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Apple TV-style zoom animation
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleWatchlistToggle = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Sign in to save items to your watchlist and sync across devices.',
        [{ text: 'OK' }]
      );
      return;
    }
    if (!details) return;
    const title = 'title' in details ? details.title : details.name;
    if (inWatchlist) {
      removeFromWatchlist.mutate({ id, mediaType });
    } else {
      addToWatchlist.mutate({ id, mediaType, title, poster_path: details.poster_path, vote_average: details.vote_average });
    }
  };

  const handleProviderPress = async (providerId: number) => {
    if (!details) return;
    const title = 'title' in details ? details.title : details.name;
    const encodedTitle = encodeURIComponent(title);
    const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
    const providerInput = {
      title,
      mediaType,
      providerPageUrl: usProviders?.link,
      imdbId: details.external_ids?.imdb_id,
      year: releaseYear,
    };
    const fallbackWebUrl =
      getProviderWebUrl(providerId, providerInput) ||
      `https://www.justwatch.com/us/search?q=${encodedTitle}`;

    if (Platform.OS === 'web') {
      window.open(fallbackWebUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const result = await openStreamingProvider(providerId, providerInput);
    if (!result.success) {
      await RNLinking.openURL(fallbackWebUrl);
    }
  };

  if (isLoading) return <View style={[styles.container, { backgroundColor: colors.background }]}><StatusBar barStyle="light-content" /><LoadingSpinner /></View>;
  if (error || !details) return <View style={[styles.container, { backgroundColor: colors.background }]}><StatusBar barStyle="light-content" /><ErrorView message="Failed to load details" onRetry={refetch} /></View>;

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const runtime = 'runtime' in details ? details.runtime : details.episode_run_time?.[0] || 0;
  const rating = details.vote_average.toFixed(1);
  const director = credits?.crew?.find((c) => c.job === 'Director' || c.job === 'Executive Producer' || c.job === 'Creator');
  const topCast = credits?.cast?.slice(0, 10) || [];
  const usProviders = providers?.results?.US;
  const flatrateProviders = usProviders?.flatrate || [];
  const rentProviders = usProviders?.rent || [];
  const buyProviders = usProviders?.buy || [];
  // Deduplicate providers by provider_id
  const seenIds = new Set<number>();
  const allProviders = [...flatrateProviders, ...rentProviders, ...buyProviders].filter((provider) => {
    if (seenIds.has(provider.provider_id)) return false;
    seenIds.add(provider.provider_id);
    return true;
  });

  const getRatingColor = (r: number) => r >= 7 ? colors.success : r >= 5 ? colors.warning : colors.error;

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backdropContainer}>
        {details.backdrop_path ? (
          <Image source={{ uri: `${IMAGE_ORIGINAL}${details.backdrop_path}` }} style={styles.backdrop} />
        ) : (
          <View style={[styles.backdrop, { backgroundColor: colors.surfaceSecondary }]} />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)', colors.background]} style={styles.backdropOverlay} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xl + 60 }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, ...typography.headline }]}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>{year}</Text>
            {runtime > 0 && <><Text style={[styles.metaDot, { color: colors.textTertiary }]}> • </Text><Text style={[styles.meta, { color: colors.textSecondary }]}>{runtime}m</Text></>}
          </View>
          <View style={styles.ratingRow}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(parseFloat(rating)) }]}><Text style={[styles.ratingText, { color: colors.textInverse }]}>{rating}</Text></View>
            <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.watchlistButton, inWatchlist ? { backgroundColor: colors.primary } : { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 2 }]} onPress={handleWatchlistToggle} activeOpacity={0.7}>
          <Ionicons name={inWatchlist ? 'bookmark' : 'bookmark-outline'} size={20} color={inWatchlist ? colors.textInverse : colors.primary} />
          <Text style={[styles.watchlistButtonText, { color: inWatchlist ? colors.textInverse : colors.primary }]}>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</Text>
        </TouchableOpacity>
        {details.tagline && <Text style={[styles.tagline, { color: colors.textTertiary }]}>"{details.tagline}"</Text>}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>Genres</Text>
          <View style={styles.genreRow}>{details.genres.map((genre) => (<View key={genre.id} style={[styles.genreTag, { backgroundColor: colors.surfaceSecondary }]}><Text style={[styles.genreText, { color: colors.text }]}>{genre.name}</Text></View>))}</View>
        </View>
        <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>Overview</Text><Text style={[styles.overview, { color: colors.textSecondary }]}>{details.overview || 'No overview available.'}</Text></View>
        {director && <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>{mediaType === 'movie' ? 'Director' : 'Creator'}</Text><Text style={[styles.directorName, { color: colors.text }]}>{director.name}</Text></View>}
        {'number_of_seasons' in details && <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>Series Info</Text><Text style={[styles.meta, { color: colors.textSecondary }]}>{details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''} • {details.number_of_episodes} Episodes</Text></View>}
        {topCast.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castContainer}>
              {topCast.map((actor, index) => (
                <TouchableOpacity key={`cast-${actor.id}-${index}`} style={styles.castCard} activeOpacity={0.7}>
                  {actor.profile_path ? <Image source={{ uri: `${PROFILE_BASE}${actor.profile_path}` }} style={[styles.castImage, { backgroundColor: colors.borderLight }]} /> : <View style={[styles.castImage, styles.castPlaceholder, { backgroundColor: colors.borderLight }]}><Ionicons name="person-outline" size={24} color={colors.textTertiary} /></View>}
                  <Text style={[styles.castName, { color: colors.text }]} numberOfLines={2}>{actor.name}</Text>
                  <Text style={[styles.castCharacter, { color: colors.textTertiary }]} numberOfLines={1}>{actor.character}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {(allProviders.length > 0) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, ...typography.title }]}>Where to Watch</Text>
            <Text style={[styles.providerHint, { color: colors.textTertiary }]}>Tap to open</Text>
            <View style={styles.providerRow}>
              {allProviders.map((provider, index) => (
                <TouchableOpacity
                  key={`provider-${provider.provider_id}-${index}`}
                  style={styles.providerTouchable}
                  onPress={() => handleProviderPress(provider.provider_id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: `${PROVIDER_LOGO_BASE}${provider.logo_path}` }}
                    style={[styles.providerLogo, { backgroundColor: colors.surface }]}
                  />
                  <Text style={[styles.providerName, { color: colors.textSecondary }]} numberOfLines={1}>
                    {provider.provider_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdropContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 280 },
  backdrop: { width: '100%', height: 280 },
  backdropOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrollContent: { paddingTop: 240 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  meta: { marginRight: 4, fontSize: 15 },
  metaDot: { marginHorizontal: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontWeight: '600', fontSize: 16 },
  ratingLabel: { fontSize: 13 },
  watchlistButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginHorizontal: 16, marginBottom: 16 },
  watchlistButtonText: { marginLeft: 8, fontWeight: '600', fontSize: 16 },
  tagline: { fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 32, marginBottom: 24 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { marginBottom: 12 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  genreText: { fontWeight: '500', fontSize: 13 },
  overview: { lineHeight: 24, fontSize: 16 },
  directorName: { fontWeight: '500', fontSize: 17 },
  castContainer: { paddingRight: 16 },
  castCard: { width: 100, marginRight: 12 },
  castImage: { width: 100, height: 150, borderRadius: 8 },
  castPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  castName: { marginTop: 6, fontWeight: '500', fontSize: 12, height: 36 },
  castCharacter: { marginTop: 2, fontSize: 11 },
  providerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  providerTouchable: { alignItems: 'center', width: 72 },
  providerLogo: { width: 50, height: 50, borderRadius: 8 },
  providerName: { fontSize: 11, marginTop: 4, textAlign: 'center', maxWidth: 72 },
  providerHint: { fontSize: 12, marginBottom: 8 },
  webLinkButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: colors.surfaceSecondary },
  webLinkText: { marginLeft: 8, fontWeight: '500', fontSize: 14 },
});
