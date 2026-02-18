/**
 * Custom hooks for media data fetching using TanStack React Query
 * Provides optimized, cached, and performant data fetching for all media operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  searchMulti,
  getMovieDetails,
  getTVDetails,
  getMovieCredits,
  getTVCredits,
  getMovieWatchProviders,
  getTVWatchProviders,
  IMAGE_BASE,
  IMAGE_BASE_LARGE,
  IMAGE_ORIGINAL,
  PROFILE_BASE,
  PROVIDER_LOGO_BASE,
} from '../services/api';
import { queryKeys } from '../services/queryClient';
import type {
  TrendingItem,
  Movie,
  TVShow,
  MovieDetails,
  TVDetails,
  Credits,
  WatchProvidersResponse,
} from '../types';

/**
 * Hook to fetch trending content (movies and TV shows combined)
 * @returns Query result with trending items
 */
export function useTrending() {
  return useQuery({
    queryKey: queryKeys.trending,
    queryFn: async () => {
      const { data } = await getTrending();
      return data.results;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for trending content
  });
}

/**
 * Hook to fetch popular movies
 * @param page Page number (defaults to 1)
 * @returns Query result with popular movies
 */
export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: queryKeys.moviesPopular(page),
    queryFn: async () => {
      const { data } = await getPopularMovies();
      return data.results;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes for popular content
  });
}

/**
 * Hook to fetch popular TV shows
 * @param page Page number (defaults to 1)
 * @returns Query result with popular TV shows
 */
export function usePopularTV(page: number = 1) {
  return useQuery({
    queryKey: queryKeys.tvPopular(page),
    queryFn: async () => {
      const { data } = await getPopularTV();
      return data.results;
    },
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch top rated movies
 * @returns Query result with top rated movies
 */
export function useTopRatedMovies() {
  return useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: async () => {
      const { data } = await getTopRatedMovies();
      return data.results;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes for top rated
  });
}

/**
 * Hook to fetch top rated TV shows
 * @returns Query result with top rated TV shows
 */
export function useTopRatedTV() {
  return useQuery({
    queryKey: ['topRatedTV'],
    queryFn: async () => {
      const { data } = await getTopRatedTV();
      return data.results;
    },
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to search for media (movies and TV shows)
 * @param query Search query string
 * @returns Query result with search results
 */
export function useSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: async () => {
      const { data } = await searchMulti(query);
      // Filter to only include movies and TV shows
      return data.results.filter(
        (item): item is TrendingItem =>
          item.media_type === 'movie' || item.media_type === 'tv'
      );
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
  });
}

/**
 * Hook to fetch movie details
 * @param id Movie ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with movie details
 */
export function useMovieDetails(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.movieDetails(id),
    queryFn: async () => {
      const { data } = await getMovieDetails(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes - details rarely change
  });
}

/**
 * Hook to fetch TV show details
 * @param id TV show ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with TV show details
 */
export function useTVDetails(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.tvDetails(id),
    queryFn: async () => {
      const { data } = await getTVDetails(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to fetch movie credits (cast and crew)
 * @param id Movie ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with movie credits
 */
export function useMovieCredits(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.movieCredits(id),
    queryFn: async () => {
      const { data } = await getMovieCredits(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 60 * 60 * 1000, // 1 hour - credits rarely change
  });
}

/**
 * Hook to fetch TV show credits (cast and crew)
 * @param id TV show ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with TV show credits
 */
export function useTVCredits(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.tvCredits(id),
    queryFn: async () => {
      const { data } = await getTVCredits(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch movie watch providers (streaming services)
 * @param id Movie ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with watch providers
 */
export function useMovieWatchProviders(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.movieWatchProviders(id),
    queryFn: async () => {
      const { data } = await getMovieWatchProviders(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 60 * 60 * 1000, // 1 hour - providers rarely change
  });
}

/**
 * Hook to fetch TV show watch providers (streaming services)
 * @param id TV show ID
 * @param enabled Whether the query should be enabled
 * @returns Query result with watch providers
 */
export function useTVWatchProviders(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.tvWatchProviders(id),
    queryFn: async () => {
      const { data } = await getTVWatchProviders(id);
      return data;
    },
    enabled: enabled && id > 0,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Combined hook to fetch all data for media detail screen
 * @param id Media ID
 * @param mediaType Media type ('movie' or 'tv')
 * @returns Combined query results for details, credits, and providers
 */
export function useMediaDetail(id: number, mediaType: 'movie' | 'tv') {
  const detailsQuery =
    mediaType === 'movie'
      ? useMovieDetails(id)
      : useTVDetails(id);

  const creditsQuery =
    mediaType === 'movie'
      ? useMovieCredits(id)
      : useTVCredits(id);

  const providersQuery =
    mediaType === 'movie'
      ? useMovieWatchProviders(id)
      : useTVWatchProviders(id);

  const isLoading = detailsQuery.isLoading || creditsQuery.isLoading || providersQuery.isLoading;
  const isFetching = detailsQuery.isFetching || creditsQuery.isFetching || providersQuery.isFetching;

  const error = detailsQuery.error || creditsQuery.error || providersQuery.error;

  return {
    details: detailsQuery.data,
    credits: creditsQuery.data,
    providers: providersQuery.data,
    isLoading,
    isFetching,
    error,
    refetch: () => {
      detailsQuery.refetch();
      creditsQuery.refetch();
      providersQuery.refetch();
    },
  };
}

/**
 * Hook to prefetch media data for smoother navigation
 * Call this when a user hovers or presses a card before navigating
 * @param id Media ID
 * @param mediaType Media type ('movie' or 'tv')
 */
export function usePrefetchMedia() {
  const queryClient = useQueryClient();

  const prefetch = (id: number, mediaType: 'movie' | 'tv') => {
    // Prefetch details
    queryClient.prefetchQuery({
      queryKey: queryKeys.mediaDetails(id, mediaType),
      queryFn: async () => {
        const { data } =
          mediaType === 'movie'
            ? await getMovieDetails(id)
            : await getTVDetails(id);
        return data;
      },
      staleTime: 30 * 60 * 1000,
    });

    // Prefetch credits
    queryClient.prefetchQuery({
      queryKey: queryKeys.mediaCredits(id, mediaType),
      queryFn: async () => {
        const { data } =
          mediaType === 'movie'
            ? await getMovieCredits(id)
            : await getTVCredits(id);
        return data;
      },
      staleTime: 60 * 60 * 1000,
    });
  };

  return prefetch;
}

/**
 * Hook to invalidate media queries (trigger refetch)
 */
export function useInvalidateMedia() {
  const queryClient = useQueryClient();

  return {
    invalidateTrending: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.trending }),
    invalidatePopularMovies: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.popularMovies }),
    invalidatePopularTV: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.popularTV }),
    invalidateSearch: () =>
      queryClient.invalidateQueries({ queryKey: ['search'] }),
    invalidateMedia: (id: number, mediaType: 'movie' | 'tv') => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mediaDetails(id, mediaType) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mediaCredits(id, mediaType) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mediaWatchProviders(id, mediaType) });
    },
  };
}

// Re-export image URL helpers for convenience
export { IMAGE_BASE, IMAGE_BASE_LARGE, IMAGE_ORIGINAL, PROFILE_BASE, PROVIDER_LOGO_BASE };
