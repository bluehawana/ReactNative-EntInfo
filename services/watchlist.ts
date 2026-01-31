import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = 'entinfo_watchlist';

export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    const data = await AsyncStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
}

export async function addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>): Promise<boolean> {
  try {
    const watchlist = await getWatchlist();
    const exists = watchlist.some(
      (i) => i.id === item.id && i.mediaType === item.mediaType
    );

    if (exists) return false;

    const newItem: WatchlistItem = {
      ...item,
      addedAt: Date.now(),
    };

    watchlist.unshift(newItem);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
}

export async function removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): Promise<boolean> {
  try {
    const watchlist = await getWatchlist();
    const filtered = watchlist.filter(
      (item) => !(item.id === id && item.mediaType === mediaType)
    );

    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
}

export async function isInWatchlist(id: number, mediaType: 'movie' | 'tv'): Promise<boolean> {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some((item) => item.id === id && item.mediaType === mediaType);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
}
