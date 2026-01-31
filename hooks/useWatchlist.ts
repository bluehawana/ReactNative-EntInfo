/**
 * Custom hook for watchlist management using TanStack React Query
 * Provides optimized CRUD operations for user's watchlist
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as watchlistService from '../services/watchlist';
import type { WatchlistItem } from '../services/watchlist';

const WATCHLIST_QUERY_KEY = ['watchlist'] as const;

/**
 * Hook to fetch the user's watchlist
 * @returns Query result with watchlist items
 */
export function useWatchlist() {
  return useQuery({
    queryKey: WATCHLIST_QUERY_KEY,
    queryFn: watchlistService.getWatchlist,
    staleTime: Infinity, // Watchlist is user data, don't stale it
    gcTime: Infinity, // Keep in cache indefinitely
  });
}

/**
 * Hook to check if an item is in the watchlist
 * @param id Media ID
 * @param mediaType Media type ('movie' or 'tv')
 * @returns Query result with boolean indicating if item is in watchlist
 */
export function useIsInWatchlist(id: number, mediaType: 'movie' | 'tv') {
  return useQuery({
    queryKey: [...WATCHLIST_QUERY_KEY, 'check', id, mediaType],
    queryFn: () => watchlistService.isInWatchlist(id, mediaType),
    staleTime: Infinity,
    enabled: id > 0,
  });
}

/**
 * Hook to add an item to the watchlist
 * @returns Mutation for adding items to watchlist
 */
export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<WatchlistItem, 'addedAt'>) =>
      watchlistService.addToWatchlist(item),
    onSuccess: () => {
      // Invalidate watchlist query to refetch
      queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
    },
  });
}

/**
 * Hook to remove an item from the watchlist
 * @returns Mutation for removing items from watchlist
 */
export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; mediaType: 'movie' | 'tv' }) =>
      watchlistService.removeFromWatchlist(params.id, params.mediaType),
    onSuccess: (_, variables) => {
      // Invalidate watchlist query
      queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });

      // Also invalidate specific check query
      queryClient.invalidateQueries({
        queryKey: [...WATCHLIST_QUERY_KEY, 'check', variables.id, variables.mediaType],
      });
    },
  });
}

/**
 * Combined hook for watchlist toggle functionality
 * Used in detail screens and media cards
 * @param id Media ID
 * @param mediaType Media type ('movie' or 'tv')
 * @returns Object with isInWatchlist, toggleWatchlist, and loading states
 */
export function useWatchlistToggle(id: number, mediaType: 'movie' | 'tv') {
  const queryClient = useQueryClient();
  const { data: isInWatchlist, isLoading: isChecking } = useIsInWatchlist(id, mediaType);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ id, mediaType });
    } else {
      // Get current watchlist to find the item data
      queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
    }
  };

  return {
    isInWatchlist: isInWatchlist ?? false,
    isChecking,
    isAdding: addToWatchlist.isPending,
    isRemoving: removeFromWatchlist.isPending,
    toggleWatchlist,
  };
}

/**
 * Hook to get the count of items in watchlist
 * @returns Query result with watchlist count
 */
export function useWatchlistCount() {
  return useQuery({
    queryKey: [...WATCHLIST_QUERY_KEY, 'count'],
    queryFn: async () => {
      const list = await watchlistService.getWatchlist();
      return list.length;
    },
    staleTime: Infinity,
  });
}

// Re-export types
export type { WatchlistItem };
