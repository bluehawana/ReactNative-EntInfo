/**
 * Centralized hooks export
 * Import all custom hooks from here
 */

// Media hooks
export {
  useTrending,
  usePopularMovies,
  usePopularTV,
  useSearch,
  useMovieDetails,
  useTVDetails,
  useMovieCredits,
  useTVCredits,
  useMovieWatchProviders,
  useTVWatchProviders,
  useMediaDetail,
  usePrefetchMedia,
  useInvalidateMedia,
  IMAGE_BASE,
  IMAGE_BASE_LARGE,
  PROFILE_BASE,
} from './useMedia';

// Watchlist hooks
export {
  useWatchlist,
  useIsInWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlistToggle,
  useWatchlistCount,
} from './useWatchlist';
