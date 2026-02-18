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
  IMAGE_ORIGINAL,
  PROFILE_BASE,
  PROVIDER_LOGO_BASE,
} from './useMedia';

// Auth hooks
export { useAuth, AuthProvider } from './useAuth';

// Watchlist hooks
export {
  useWatchlist,
  useIsInWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlistToggle,
  useWatchlistCount,
} from './useWatchlist';