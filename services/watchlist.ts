import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const WATCHLIST_KEY = '2watchhub_watchlist';
const FIRESTORE_RETRY_BASE_MS = 150;
const FIRESTORE_RETRY_ATTEMPTS = 1;
const FIRESTORE_LOG_THROTTLE_MS = 30_000;
const RETRYABLE_FIRESTORE_CODES = new Set([
  'firestore/unavailable',
  'firestore/deadline-exceeded',
  'firestore/aborted',
  'firestore/resource-exhausted',
]);
const firestoreLogTimestamps = new Map<string, number>();

export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
}

function getUid(): string | null {
  return getAuth().currentUser?.uid ?? null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getFirestoreErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) return null;
  const maybeCode = (error as { code?: unknown }).code;
  return typeof maybeCode === 'string' ? maybeCode : null;
}

function isTransientFirestoreError(error: unknown): boolean {
  const code = getFirestoreErrorCode(error);
  return code !== null && RETRYABLE_FIRESTORE_CODES.has(code);
}

function logFirestoreIssue(context: string, error: unknown): void {
  const now = Date.now();
  const key = `${context}:${getFirestoreErrorCode(error) ?? 'unknown'}`;
  const lastLoggedAt = firestoreLogTimestamps.get(key) ?? 0;
  if (now - lastLoggedAt < FIRESTORE_LOG_THROTTLE_MS) return;
  firestoreLogTimestamps.set(key, now);
  console.warn(`[watchlist] ${context}:`, error);
}

async function withFirestoreRetry<T>(
  operation: () => Promise<T>,
  attempts: number = FIRESTORE_RETRY_ATTEMPTS
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      const canRetry = isTransientFirestoreError(error) && attempt < attempts;
      if (!canRetry) throw error;
      const delay = FIRESTORE_RETRY_BASE_MS * Math.pow(2, attempt);
      await sleep(delay);
      attempt += 1;
    }
  }
}

function watchlistCollection(uid: string) {
  return collection(getFirestore(), 'users', uid, 'watchlist');
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

async function addToLocalWatchlist(item: WatchlistItem): Promise<boolean> {
  try {
    const watchlist = await getLocalWatchlist();
    const exists = watchlist.some(
      (i) => i.id === item.id && i.mediaType === item.mediaType
    );
    if (exists) return false;
    watchlist.unshift(item);
    await setLocalWatchlist(watchlist);
    return true;
  } catch (error) {
    console.error('Error adding to local watchlist:', error);
    return false;
  }
}

async function removeFromLocalWatchlist(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<boolean> {
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

async function isInLocalWatchlist(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<boolean> {
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

// --- Firestore methods ---

async function getFirestoreWatchlist(uid: string): Promise<WatchlistItem[]> {
  const watchlistQuery = query(watchlistCollection(uid), orderBy('addedAt', 'desc'));
  const snapshot: FirebaseFirestoreTypes.QuerySnapshot = await withFirestoreRetry(() =>
    getDocs(watchlistQuery)
  );
  return snapshot.docs.map((itemDoc) => itemDoc.data() as WatchlistItem);
}

async function addToFirestore(uid: string, item: WatchlistItem): Promise<void> {
  const docId = `${item.mediaType}_${item.id}`;
  await withFirestoreRetry(() => setDoc(doc(watchlistCollection(uid), docId), item));
}

async function removeFromFirestore(
  uid: string,
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<void> {
  const docId = `${mediaType}_${id}`;
  await withFirestoreRetry(() => deleteDoc(doc(watchlistCollection(uid), docId)));
}

// --- Merge local watchlist into Firestore on first login ---

export async function mergeLocalWatchlistToFirestore(): Promise<void> {
  const uid = getUid();
  if (!uid) return;

  const localItems = await getLocalWatchlist();
  if (localItems.length === 0) return;

  let firestoreItems: WatchlistItem[];
  try {
    firestoreItems = await getFirestoreWatchlist(uid);
  } catch (error) {
    if (isTransientFirestoreError(error)) {
      logFirestoreIssue('Firestore temporarily unavailable during merge', error);
      return;
    }
    console.error('Error merging watchlist to Firestore:', error);
    return;
  }
  const existingIds = new Set(
    firestoreItems.map((i) => `${i.mediaType}_${i.id}`)
  );

  const batch = writeBatch(getFirestore());
  let hasChanges = false;
  for (const item of localItems) {
    const docId = `${item.mediaType}_${item.id}`;
    if (!existingIds.has(docId)) {
      const ref = doc(watchlistCollection(uid), docId);
      batch.set(ref, item);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    try {
      await withFirestoreRetry(() => batch.commit());
    } catch (error) {
      if (isTransientFirestoreError(error)) {
        logFirestoreIssue('Firestore temporarily unavailable during merge commit', error);
        return;
      }
      console.error('Error committing merged watchlist to Firestore:', error);
    }
  }
}

// --- Public API (auto-selects local vs Firestore) ---

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const uid = getUid();
  if (uid) {
    try {
      return await getFirestoreWatchlist(uid);
    } catch (error) {
      if (isTransientFirestoreError(error)) {
        logFirestoreIssue('Firestore temporarily unavailable, falling back to local watchlist', error);
      } else {
        console.error('Error getting Firestore watchlist, falling back to local:', error);
      }
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
      if (isTransientFirestoreError(error)) {
        logFirestoreIssue('Firestore temporarily unavailable, saving add locally', error);
        return addToLocalWatchlist(newItem);
      }
      console.error('Error adding to Firestore watchlist:', error);
      return false;
    }
  }

  // Local fallback
  return addToLocalWatchlist(newItem);
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
      if (isTransientFirestoreError(error)) {
        logFirestoreIssue('Firestore temporarily unavailable, removing locally', error);
        return removeFromLocalWatchlist(id, mediaType);
      }
      console.error('Error removing from Firestore watchlist:', error);
      return false;
    }
  }

  return removeFromLocalWatchlist(id, mediaType);
}

export async function isInWatchlist(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<boolean> {
  const uid = getUid();
  if (uid) {
    try {
      const docId = `${mediaType}_${id}`;
      const itemDoc = await withFirestoreRetry(() =>
        getDoc(doc(watchlistCollection(uid), docId))
      );
      return itemDoc.exists();
    } catch (error) {
      if (isTransientFirestoreError(error)) {
        logFirestoreIssue('Firestore temporarily unavailable during watchlist check, checking local', error);
        return isInLocalWatchlist(id, mediaType);
      }
      console.error('Error checking Firestore watchlist:', error);
      return false;
    }
  }

  return isInLocalWatchlist(id, mediaType);
}
