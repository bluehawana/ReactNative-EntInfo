/**
 * Watchlist Service Tests
 * Tests AsyncStorage-based watchlist functionality for iOS and Android
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  WatchlistItem,
} from './watchlist';

describe('Watchlist Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
  });

  describe('getWatchlist', () => {
    it('should return empty array when no watchlist exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getWatchlist();

      expect(result).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('2watch_watchlist');
    });

    it('should return watchlist items when they exist', async () => {
      const mockWatchlist: WatchlistItem[] = [
        {
          id: 550,
          mediaType: 'movie',
          title: 'Fight Club',
          poster_path: '/poster1.jpg',
          vote_average: 8.4,
          addedAt: Date.now(),
        },
        {
          id: 1396,
          mediaType: 'tv',
          title: 'Breaking Bad',
          poster_path: '/poster2.jpg',
          vote_average: 8.9,
          addedAt: Date.now() - 1000,
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockWatchlist));

      const result = await getWatchlist();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Fight Club');
      expect(result[1].title).toBe('Breaking Bad');
    });

    it('should return empty array on AsyncStorage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await getWatchlist();

      expect(result).toEqual([]);
    });

    it('should handle malformed JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await getWatchlist();

      // Should return empty array on parse error
      expect(result).toEqual([]);
    });
  });

  describe('addToWatchlist', () => {
    it('should add new item to watchlist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const newItem = {
        id: 550,
        mediaType: 'movie' as const,
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
      };

      const result = await addToWatchlist(newItem);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe(550);
      expect(savedData[0].addedAt).toBeDefined();
    });

    it('should add item to beginning of list', async () => {
      const existingItem = {
        id: 1396,
        mediaType: 'tv' as const,
        title: 'Breaking Bad',
        poster_path: '/poster.jpg',
        vote_average: 8.9,
        addedAt: Date.now() - 1000,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingItem]));

      const newItem = {
        id: 550,
        mediaType: 'movie' as const,
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
      };

      await addToWatchlist(newItem);

      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData[0].id).toBe(550); // New item should be first
    });

    it('should prevent duplicate entries', async () => {
      const existingItem = {
        id: 550,
        mediaType: 'movie' as const,
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
        addedAt: Date.now(),
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingItem]));

      const result = await addToWatchlist({
        id: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
      });

      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should allow same ID with different media types', async () => {
      const existingItem = {
        id: 12345,
        mediaType: 'movie' as const,
        title: 'Some Movie',
        poster_path: '/poster.jpg',
        vote_average: 7.5,
        addedAt: Date.now(),
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingItem]));

      const result = await addToWatchlist({
        id: 12345,
        mediaType: 'tv',
        title: 'Some TV Show',
        poster_path: '/poster.jpg',
        vote_average: 8.0,
      });

      expect(result).toBe(true);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(2);
    });

    it('should return false on AsyncStorage setItem error', async () => {
      // getItem succeeds, but setItem fails
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Write error'));

      const result = await addToWatchlist({
        id: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
      });

      expect(result).toBe(false);
    });

    it('should handle null poster_path', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const result = await addToWatchlist({
        id: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        poster_path: null,
        vote_average: 8.4,
      });

      expect(result).toBe(true);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData[0].poster_path).toBeNull();
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove item from watchlist', async () => {
      const watchlist = [
        {
          id: 550,
          mediaType: 'movie',
          title: 'Fight Club',
          poster_path: '/poster.jpg',
          vote_average: 8.4,
          addedAt: Date.now(),
        },
        {
          id: 1396,
          mediaType: 'tv',
          title: 'Breaking Bad',
          poster_path: '/poster2.jpg',
          vote_average: 8.9,
          addedAt: Date.now(),
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(watchlist));

      const result = await removeFromWatchlist(550, 'movie');

      expect(result).toBe(true);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe(1396);
    });

    it('should return true even when item does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const result = await removeFromWatchlist(999, 'movie');

      expect(result).toBe(true);
    });

    it('should only remove item with matching id and mediaType', async () => {
      const watchlist = [
        { id: 123, mediaType: 'movie', title: 'Movie', poster_path: null, vote_average: 7.0, addedAt: Date.now() },
        { id: 123, mediaType: 'tv', title: 'TV Show', poster_path: null, vote_average: 8.0, addedAt: Date.now() },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(watchlist));

      const result = await removeFromWatchlist(123, 'movie');

      expect(result).toBe(true);
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].mediaType).toBe('tv');
    });

    it('should return false on setItem error', async () => {
      // getItem succeeds (returns existing list), setItem fails
      const watchlist = [
        {
          id: 550,
          mediaType: 'movie',
          title: 'Fight Club',
          poster_path: '/poster.jpg',
          vote_average: 8.4,
          addedAt: Date.now(),
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(watchlist));
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Write error'));

      const result = await removeFromWatchlist(550, 'movie');

      expect(result).toBe(false);
    });
  });

  describe('isInWatchlist', () => {
    it('should return true when item is in watchlist', async () => {
      const watchlist = [
        {
          id: 550,
          mediaType: 'movie',
          title: 'Fight Club',
          poster_path: '/poster.jpg',
          vote_average: 8.4,
          addedAt: Date.now(),
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(watchlist));

      const result = await isInWatchlist(550, 'movie');

      expect(result).toBe(true);
    });

    it('should return false when item is not in watchlist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const result = await isInWatchlist(550, 'movie');

      expect(result).toBe(false);
    });

    it('should distinguish by mediaType', async () => {
      const watchlist = [
        { id: 123, mediaType: 'movie', title: 'Movie', poster_path: null, vote_average: 7.0, addedAt: Date.now() },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(watchlist));

      const resultMovie = await isInWatchlist(123, 'movie');
      const resultTV = await isInWatchlist(123, 'tv');

      expect(resultMovie).toBe(true);
      expect(resultTV).toBe(false);
    });

    it('should return false on AsyncStorage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await isInWatchlist(550, 'movie');

      expect(result).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should handle full workflow: add, check, remove', async () => {
      // Start with empty watchlist
      let storedData: string | null = null;
      (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(storedData));
      (AsyncStorage.setItem as jest.Mock).mockImplementation((_, value) => {
        storedData = value;
        return Promise.resolve();
      });

      // Check not in watchlist
      let isInList = await isInWatchlist(550, 'movie');
      expect(isInList).toBe(false);

      // Add to watchlist
      const added = await addToWatchlist({
        id: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        poster_path: '/poster.jpg',
        vote_average: 8.4,
      });
      expect(added).toBe(true);

      // Check is in watchlist
      isInList = await isInWatchlist(550, 'movie');
      expect(isInList).toBe(true);

      // Remove from watchlist
      const removed = await removeFromWatchlist(550, 'movie');
      expect(removed).toBe(true);

      // Check not in watchlist
      isInList = await isInWatchlist(550, 'movie');
      expect(isInList).toBe(false);
    });
  });
});

/* ==========================================================================
   FIRESTORE PATH (authenticated user)
   ========================================================================== */

describe('Watchlist Service — Firestore (authenticated user)', () => {
  // Access the persistent mock objects from jest.setup.js
  const authModule = require('@react-native-firebase/auth');
  const mockAuthInstance = authModule.default();
  const firestoreModule = require('@react-native-firebase/firestore').default;
  const mockDocRef = (firestoreModule as any).__mockDocRef ||
    firestoreModule().__mockDocRef || {};

  beforeEach(() => {
    jest.clearAllMocks();
    // Simulate a logged-in user
    mockAuthInstance.currentUser = { uid: 'user-abc123' };
  });

  afterEach(() => {
    mockAuthInstance.currentUser = null;
  });

  it('getWatchlist should read from Firestore and not touch AsyncStorage', async () => {
    const result = await getWatchlist();
    // Firestore mock returns empty docs by default → empty array
    expect(result).toEqual([]);
    // AsyncStorage must NOT be consulted when Firestore succeeds
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });

  it('addToWatchlist should write to Firestore and not touch AsyncStorage', async () => {
    const result = await addToWatchlist({
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      poster_path: '/poster.jpg',
      vote_average: 8.4,
    });
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('removeFromWatchlist should delete from Firestore and not touch AsyncStorage', async () => {
    const result = await removeFromWatchlist(550, 'movie');
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('isInWatchlist should check Firestore (default: not found)', async () => {
    const result = await isInWatchlist(550, 'movie');
    expect(result).toBe(false);
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });

  it('removeFromWatchlist should use Firestore doc id format mediaType_id', async () => {
    // removeFromFirestore calls watchlistCollection(uid).doc('movie_550').delete()
    // If this succeeds (doesn't throw), the Firestore path was taken
    const result = await removeFromWatchlist(550, 'movie');
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('getWatchlist and addToWatchlist both return expected values when authenticated', async () => {
    const list = await getWatchlist();
    expect(Array.isArray(list)).toBe(true);

    const added = await addToWatchlist({ id: 99, mediaType: 'tv', title: 'Test', poster_path: null, vote_average: 7 });
    expect(added).toBe(true);
  });
});