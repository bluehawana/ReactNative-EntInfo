/**
 * TanStack React Query Configuration
 * Optimized for React Native with proper caching and offline support
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure the Query Client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: 5 minutes - data stays fresh
      staleTime: 5 * 60 * 1000,
      // Cache time: 30 minutes - data kept in cache
      gcTime: 30 * 60 * 1000,
      // Retry failed requests
      retry: 2,
      // Delay between retries with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (app comes back to foreground)
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      // Delay between retries
      retryDelay: 1000,
    },
  },
});

/**
 * Query Keys - Centralized query key factory for React Query
 */
export const queryKeys = {
  // Trending content
  trending: ['trending'] as const,
  trendingAll: () => ['trending', 'all'] as const,

  // Movies
  popularMovies: ['movies', 'popular'] as const,
  moviesPopular: (page: number = 1) => ['movies', 'popular', page] as const,

  // TV Shows
  popularTV: ['tv', 'popular'] as const,
  tvPopular: (page: number = 1) => ['tv', 'popular', page] as const,

  // Search
  search: (query: string) => ['search', query] as const,
  searchMovies: (query: string) => ['search', 'movies', query] as const,

  // Details
  movieDetails: (id: number) => ['movie', id, 'details'] as const,
  tvDetails: (id: number) => ['tv', id, 'details'] as const,
  mediaDetails: (id: number, type: 'movie' | 'tv') => [type, id, 'details'] as const,

  // Credits
  movieCredits: (id: number) => ['movie', id, 'credits'] as const,
  tvCredits: (id: number) => ['tv', id, 'credits'] as const,
  mediaCredits: (id: number, type: 'movie' | 'tv') => [type, id, 'credits'] as const,

  // Watch Providers
  movieWatchProviders: (id: number) => ['movie', id, 'providers'] as const,
  tvWatchProviders: (id: number) => ['tv', id, 'providers'] as const,
  mediaWatchProviders: (id: number, type: 'movie' | 'tv') =>
    [type, id, 'providers'] as const,
} as const;

export type QueryKeys = typeof queryKeys;
