import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const WATCHLIST_KEY = '2watch_watchlist';

export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
}

function getUid(): string | null {
  return auth().currentUser?.uid ?? null;
}

function watchlistCollection(uid: string) {
  return firestore().collection('users').doc(uid).collection('watchlist');
}

// --- Local (AsyncStorage) methods ---

async function getLocalWatchlist(): Promise<WatchlistItem[]> {
  try {
    const data = await AsyncStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting local watchlist:', error);
    return [];
  }
}

async function setLocalWatchlist(items: WatchlistItem[]): Promise<void> {
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

// --- Firestore methods ---

async function getFirestoreWatchlist(uid: string): Promise<WatchlistItem[]> {
  const snapshot = await watchlistCollection(uid)
    .orderBy('addedAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => doc.data() as WatchlistItem);
}

async function addToFirestore(uid: string, item: WatchlistItem): Promise<void> {
  const docId = `${item.mediaType}_${item.id}`;
  await watchlistCollection(uid).doc(docId).set(item);
}

async function removeFromFirestore(
  uid: string,
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<void> {
  const docId = `${mediaType}_${id}`;
  await watchlistCollection(uid).doc(docId).delete();
}

// --- Merge local watchlist into Firestore on first login ---

export async function mergeLocalWatchlistToFirestore(): Promise<void> {
  const uid = getUid();
  if (!uid) return;

  const localItems = await getLocalWatchlist();
  if (localItems.length === 0) return;

  const firestoreItems = await getFirestoreWatchlist(uid);
  const existingIds = new Set(
    firestoreItems.map((i) => `${i.mediaType}_${i.id}`)
  );

  const batch = firestore().batch();
  let hasChanges = false;
  for (const item of localItems) {
    const docId = `${item.mediaType}_${item.id}`;
    if (!existingIds.has(docId)) {
      const ref = watchlistCollection(uid).doc(docId);
      batch.set(ref, item);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    await batch.commit();
  }
}

// --- Public API (auto-selects local vs Firestore) ---

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const uid = getUid();
  if (uid) {
    try {
      return await getFirestoreWatchlist(uid);
    } catch (error) {
      console.error('Error getting Firestore watchlist, falling back to local:', error);
      return getLocalWatchlist();
    }
  }
  return getLocalWatchlist();
}

export async function addToWatchlist(
  item: Omit<WatchlistItem, 'addedAt'>
): Promise<boolean> {
  const newItem: WatchlistItem = {
    ...item,
    addedAt: Date.now(),
  };

  const uid = getUid();
  if (uid) {
    try {
      const exists = await isInWatchlist(item.id, item.mediaType);
      if (exists) return false;
      await addToFirestore(uid, newItem);
      return true;
    } catch (error) {
      console.error('Error adding to Firestore watchlist:', error);
      return false;
    }
  }

  // Local fallback
  try {
    const watchlist = await getLocalWatchlist();
    const exists = watchlist.some(
      (i) => i.id === item.id && i.mediaType === item.mediaType
    );
    if (exists) return false;
    watchlist.unshift(newItem);
    await setLocalWatchlist(watchlist);
    return true;
  } catch (error) {
    console.error('Error adding to local watchlist:', error);
    return false;
  }
}

export async function removeFromWatchlist(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<boolean> {
  const uid = getUid();
  if (uid) {
    try {
      await removeFromFirestore(uid, id, mediaType);
      return true;
    } catch (error) {
      console.error('Error removing from Firestore watchlist:', error);
      return false;
    }
  }

  try {
    const watchlist = await getLocalWatchlist();
    const filtered = watchlist.filter(
      (item) => !(item.id === id && item.mediaType === mediaType)
    );
    await setLocalWatchlist(filtered);
    return true;
  } catch (error) {
    console.error('Error removing from local watchlist:', error);
    return false;
  }
}

export async function isInWatchlist(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<boolean> {
  const uid = getUid();
  if (uid) {
    try {
      const docId = `${mediaType}_${id}`;
      const doc = await watchlistCollection(uid).doc(docId).get();
      return doc.exists();
    } catch (error) {
      console.error('Error checking Firestore watchlist:', error);
      return false;
    }
  }

  try {
    const watchlist = await getLocalWatchlist();
    return watchlist.some(
      (item) => item.id === id && item.mediaType === mediaType
    );
  } catch (error) {
    console.error('Error checking local watchlist:', error);
    return false;
  }
}
